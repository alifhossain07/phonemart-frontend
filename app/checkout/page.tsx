"use client";
import Image from "next/image";
import { useCart, CartItem } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderCompleteModal from "@/components/checkout/OrderCompleteModal";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface CheckoutFormData {
  name: string;
  mobile: string;
  email?: string;
  address: string;
  payment: "online" | "cod";
  agreeTerms: boolean;
  promoCode?: string;
  deliveryMethod: "inside" | "outside";
}

interface CouponData {
  id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order?: number;
  max_discount?: number;
  expiry_date?: string;
}


// ------------------------- Yup Schema -------------------------
const schema: yup.ObjectSchema<CheckoutFormData> = yup.object({
  name: yup.string().required("Name is required"),
  mobile: yup
    .string()
    .matches(/^\d{11}$/, "Mobile must be 11 digits")
    .required("Mobile number is required"),
  email: yup.string().email("Invalid email").optional(),
  address: yup.string().required("Address is required"),
  deliveryMethod: yup
    .mixed<CheckoutFormData["deliveryMethod"]>()
    .oneOf(["inside", "outside"], "Select a delivery method")
    .required("Delivery method is required"),
  payment: yup
    .mixed<CheckoutFormData["payment"]>()
    .required("Payment method is required"),
  agreeTerms: yup
    .boolean()
    .oneOf([true], "You must accept terms")
    .required("You must accept terms"),
  promoCode: yup.string().optional(),
});
// ------------------------- Checkout Page -------------------------
const CheckoutPage: React.FC = () => {
  const { cart, selectedItems, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart();
  const { user, accessToken } = useAuth();
  const [showOrderCompleteModal, setShowOrderCompleteModal] = React.useState(false);
  const [completedOrderId, setCompletedOrderId] = React.useState<string | null>(null);
  const [showStripePayment, setShowStripePayment] = React.useState(false);
  const [stripeClientSecret, setStripeClientSecret] = React.useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = React.useState<string | null>(null);
  const [pendingOrderData, setPendingOrderData] = React.useState<CheckoutFormData | null>(null);

  // Filter selected items - if no items selected, use all cart items
  const selectedCart: CartItem[] = selectedItems.length > 0 
    ? cart.filter((item) => selectedItems.includes(item.id))
    : cart;

  // Totals
  // Subtotal should reflect pre-discount sum; discount reflects savings
  const subtotal = selectedCart.reduce(
    (acc, item) => {
      const oldPrice = Number(item.oldPrice) || Number(item.price);
      const price = Number(item.price);
      const qty = Number(item.qty) || 1;
      return acc + (oldPrice * qty);
    },
    0
  );
  const discount = selectedCart.reduce(
    (acc, item) => {
      const oldPrice = Number(item.oldPrice) || Number(item.price);
      const price = Number(item.price);
      const qty = Number(item.qty) || 1;
      const itemDiscount = Math.max(0, oldPrice - price) * qty;
      return acc + itemDiscount;
    },
    0
  );

  // ------------------------- React Hook Form -------------------------
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      address: "",
      deliveryMethod: "inside",
      payment: "cod",
      agreeTerms: true,
      promoCode: "",
    },
  });

  const deliveryMethod = watch("deliveryMethod");

  // Dynamic shipping config
  const [shippingConfig, setShippingConfig] = React.useState<{
    shipping_cost_inside_dhaka: number;
    shipping_cost_outside_dhaka: number;
    free_shipping_min_amount: number;
    currency_symbol?: string;
    currency_code?: string;
  } | null>(null);

  // Load shipping config from API
  React.useEffect(() => {
    const fetchShippingConfig = async () => {
      try {
        const response = await fetch('/api/shipping-config');
        const result = await response.json();
        if (result.success && result.data) {
          setShippingConfig(result.data);
        }
      } catch (err) {
        console.error("Error fetching shipping config:", err);
      }
    };
    fetchShippingConfig();
  }, []);

  // Pre-fill form with user data when logged in
  React.useEffect(() => {
    if (user) {
      // Only pre-fill if fields are currently empty (don't overwrite user input)
      const currentValues = getValues();
      
      if (!currentValues.name && user.name) {
        setValue("name", user.name, { shouldValidate: false });
      }
      if (!currentValues.mobile && user.phone) {
        setValue("mobile", user.phone, { shouldValidate: false });
      }
      if (!currentValues.email && user.email) {
        setValue("email", user.email, { shouldValidate: false });
      }
      if (!currentValues.address && user.address) {
        setValue("address", user.address, { shouldValidate: false });
      }
    }
  }, [user, setValue, getValues]);

  // Shipping charges (dynamic from config)
  const insideDhaka = shippingConfig?.shipping_cost_inside_dhaka ?? 60;
  const outsideDhaka = shippingConfig?.shipping_cost_outside_dhaka ?? 140;
  const freeMin = shippingConfig?.free_shipping_min_amount ?? 0;
  const currencySymbol = shippingConfig?.currency_symbol ?? "৳";


  let deliveryCharge = 0;
  if (deliveryMethod === "inside") deliveryCharge = insideDhaka;
  else if (deliveryMethod === "outside") deliveryCharge = outsideDhaka;

  const merchandiseTotal = subtotal - discount;
  if (freeMin > 0 && merchandiseTotal >= freeMin) {
    deliveryCharge = 0;
  }

  // ------------------------- Promo Code States & Logic -------------------------
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = React.useState<number>(0);
  const [couponData, setCouponData] = React.useState<CouponData | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = React.useState(false);

  const validatePromoCode = async (code: string) => {
    setIsValidatingPromo(true);
    try {
      const baseAmount = subtotal - discount;
      
      const response = await fetch('/api/coupon-apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.toUpperCase().trim(),
          amount: baseAmount,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setAppliedPromo(code.toUpperCase().trim());
        setCouponData({
          id: result.data.id,
          code: result.data.code,
          type: result.data.type,
          value: result.data.value,
          min_order: result.data.min_order,
          max_discount: result.data.max_discount,
        });
        toast.success(`Coupon "${code.toUpperCase()}" applied successfully! ✅`, {
          style: {
            background: "#10b981",
            color: "#ffffff",
            fontWeight: 500,
          },
        });
        return true;
      } else {
        toast.error(result.error || result.message || "Invalid promo code ❌", {
          style: {
            background: "#ef4444",
            color: "#ffffff",
            fontWeight: 500,
          },
        });
        setAppliedPromo(null);
        setCouponData(null);
        return false;
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast.error("Failed to validate promo code ❌", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
      setAppliedPromo(null);
      setCouponData(null);
      return false;
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleApplyPromo = async () => {
    const code = watch("promoCode")?.toUpperCase().trim();
    if (!code) {
      toast.error("Please enter a promo code ❌");
      return;
    }

    await validatePromoCode(code);
  };

  // Calculate promo discount based on API response
  React.useEffect(() => {
    if (couponData && appliedPromo) {
      const baseAmount = subtotal - discount;
      let discountAmount = 0;
      
      if (couponData.type === "percentage") {
        discountAmount = baseAmount * (couponData.value / 100);
        // Apply max_discount limit if set
        if (couponData.max_discount && discountAmount > couponData.max_discount) {
          discountAmount = couponData.max_discount;
        }
      } else {
        discountAmount = couponData.value;
      }
      
      // Ensure discount doesn't exceed base amount
      discountAmount = Math.min(discountAmount, baseAmount);
      setPromoDiscount(discountAmount);
    } else {
      setPromoDiscount(0);
    }
  }, [couponData, appliedPromo, subtotal, discount]);

  const effectiveDelivery = deliveryCharge;
  const total = subtotal - discount + effectiveDelivery - promoDiscount;

  // ------------------------- Payment Modal -------------------------
  // Payment modal removed
  // Online payment state (commented for future use)
  // const [paymentData, setPaymentData] = React.useState<CheckoutFormData | null>(null);
  // const [selectedPaymentMethod, setSelectedPaymentMethod] =
  //   React.useState<"visa" | "mastercard" | "bkash" | "nagad">("visa");
  // const [paymentNumber, setPaymentNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirmOrder = async (data: CheckoutFormData) => {
    if (data.payment === "cod") {
      submitOrder(data);
    } else if (data.payment === "online") {
      // For online payment, create order first, then initiate Stripe payment
      await initiateStripePayment(data);
    }
  };

  const initiateStripePayment = async (data: CheckoutFormData) => {
    try {
      setIsLoading(true);
      
      // First, create the order with pending payment status
      const validCartItems = selectedCart.filter((item) => {
        if (!item.id || item.id === null || item.id === undefined || item.id === '') {
          return false;
        }
        if (!item.qty || item.qty <= 0) {
          return false;
        }
        return true;
      });

      if (validCartItems.length === 0) {
        toast.error("Your cart is empty or contains invalid items ❌");
        setIsLoading(false);
        return;
      }

      let shipping_zone = null;
      if (data.deliveryMethod === "inside") shipping_zone = "insideDhaka";
      else if (data.deliveryMethod === "outside") shipping_zone = "outsideDhaka";
      
      const orderPayload = {
        customer: {
          name: data.name,
          mobile: data.mobile,
          email: data.email || null,
          address: data.address.trim(),
          country_id: null,
          state_id: null,
          city_id: null,
          area_id: null,
          postal_code: null,
        },
        items: validCartItems.map((item) => {
          const productId = String(item.id).trim();
          return {
            id: productId,
            qty: Number(item.qty) || 1,
            variant: item.variant || null,
            referral_code: null,
          };
        }),
        shipping_method: "home_delivery",
        shipping_zone: shipping_zone,
        payment_method: "stripe",
        payment_number: null,
        promo_code: appliedPromo || null,
        note: "",
        pickup_point_id: null,
        carrier_id: null,
      };

      // Create order
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user?.id && accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(orderPayload),
      });
      
      const orderResponseData = await orderResponse.json();

      if (!orderResponseData.success) {
        toast.error(orderResponseData.message || "Failed to create order ❌");
        setIsLoading(false);
        return;
      }

      const orderId = orderResponseData.data?.order_id;
      const orderCode = orderResponseData.data?.order_code;
      
      if (!orderId) {
        toast.error("Failed to get order ID");
        setIsLoading(false);
        return;
      }

      // Store order data in sessionStorage for order complete modal
      if (typeof window !== "undefined") {
        let shippingMethodLabel = "";
        if (data.deliveryMethod === "inside") shippingMethodLabel = "Inside Dhaka – Home Delivery";
        else if (data.deliveryMethod === "outside") shippingMethodLabel = "Outside Dhaka – Home Delivery";

        const orderSummary = {
          orderId: orderCode || orderId, // Use order code, fallback to order ID
          customer: {
            name: data.name,
            mobile: data.mobile,
            email: data.email || "",
            address: data.address,
          },
          items: selectedCart.map((item) => ({
            id: item.id,
            name: item.name,
            qty: item.qty,
            price: item.price,
            variant: item.variant || null,
          })),
          shipping: {
            method: data.deliveryMethod,
            methodLabel: shippingMethodLabel,
            charge: effectiveDelivery,
          },
          totals: {
            subtotal,
            discount,
            deliveryCharge: effectiveDelivery,
            promoDiscount,
            total: subtotal - discount + effectiveDelivery - promoDiscount,
          },
        };

        try {
          sessionStorage.setItem("lastOrder", JSON.stringify(orderSummary));
        } catch (e) {
          console.error("Failed to save order to sessionStorage:", e);
        }
      }

      // Now create payment intent
      const paymentIntentResponse = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "bdt",
          order_data: {
            order_id: orderId,
            order_code: orderCode,
          },
        }),
      });

      const paymentIntentData = await paymentIntentResponse.json();

      if (!paymentIntentData.success || !paymentIntentData.client_secret) {
        toast.error("Failed to initialize payment");
        setIsLoading(false);
        return;
      }

      // Store payment details and show Stripe form
      setStripeClientSecret(paymentIntentData.client_secret);
      setPaymentIntentId(paymentIntentData.payment_intent_id);
      setPendingOrderData({ ...data, orderId, orderCode }); // Store order ID and code
      setShowStripePayment(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Stripe payment initiation error:", error);
      toast.error("Failed to initiate payment");
      setIsLoading(false);
    }
  };

  const handleStripePaymentSuccess = async (paymentIntentId: string) => {
    if (!pendingOrderData) return;

    try {
      // Verify payment
      const verifyResponse = await fetch(`/api/stripe/verify-payment?payment_intent_id=${paymentIntentId}`);
      const verifyData = await verifyResponse.json();

      if (verifyData.success && verifyData.payment_status === "succeeded") {
        // Clear promo after successful payment
        setAppliedPromo(null);
        setCouponData(null);
        setPromoDiscount(0);
        setValue("promoCode", "");
        
        toast.success("Payment successful! Order confirmed! 🎉");
        
        // Use order code from pendingOrderData, fallback to order ID
        const orderCode = (pendingOrderData as any)?.orderCode || (pendingOrderData as any)?.orderId || paymentIntentId;
        
        // Update sessionStorage with correct order ID
        if (typeof window !== "undefined") {
          try {
            const existingOrder = sessionStorage.getItem("lastOrder");
            if (existingOrder) {
              const orderData = JSON.parse(existingOrder);
              orderData.orderId = orderCode;
              sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
            }
          } catch (e) {
            console.error("Failed to update order ID in sessionStorage:", e);
          }
        }
        
        // Immediately sync payment status (webhook might be delayed or not working)
        try {
          const syncResponse = await fetch("/api/stripe/sync-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ payment_intent_id: paymentIntentId }),
          });
          
          const syncData = await syncResponse.json();
          if (syncData.success) {
            console.log("Payment status synced successfully");
          } else {
            console.warn("Payment status sync failed, webhook will handle it:", syncData.error);
          }
        } catch (syncError) {
          console.warn("Failed to sync payment status, webhook will handle it:", syncError);
          // Don't show error to user - webhook will eventually update it
        }
        
        // Analytics
        if (typeof window !== "undefined") {
          const itemsForAnalytics = selectedCart.map((item) => ({
            item_id: String(item.id),
            item_name: item.name,
            price: item.price,
            quantity: item.qty,
            item_variant: item.variant || "",
            item_brand: "",
            item_category: "",
          }));

          const shipping = effectiveDelivery;
          const value = subtotal - discount - promoDiscount + shipping;

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "purchase",
            ecommerce: {
              transaction_id: orderCode, // Use order code for analytics
              affiliation: "Online Store",
              value,
              tax: 0,
              shipping,
              currency: "BDT",
              coupon: appliedPromo || "",
              items: itemsForAnalytics,
            },
          });
        }

        // Clear cart and show modal
        clearCart();
        setCompletedOrderId(orderCode); // Use order code instead of payment intent ID
        setShowOrderCompleteModal(true);
        setShowStripePayment(false);
        setStripeClientSecret(null);
        setPaymentIntentId(null);
        setPendingOrderData(null);
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Failed to verify payment");
    }
  };

  const handleStripePaymentError = (error: string) => {
    toast.error(error || "Payment failed");
  };

  const handleStripePaymentCancel = () => {
    setShowStripePayment(false);
    setStripeClientSecret(null);
    setPaymentIntentId(null);
    setPendingOrderData(null);
    toast.info("Payment cancelled");
  };

  const submitOrder = async (data: CheckoutFormData) => {
    // Filter out invalid items
    const validCartItems = selectedCart.filter((item) => {
      if (!item.id || item.id === null || item.id === undefined || item.id === '') {
        console.error('Invalid cart item with missing ID:', item);
        return false;
      }
      if (!item.qty || item.qty <= 0) {
        console.error('Invalid cart item with invalid quantity:', item);
        return false;
      }
      return true;
    });

    if (validCartItems.length === 0) {
      toast.error("Your cart is empty or contains invalid items ❌");
      return;
    }

    if (validCartItems.length !== selectedCart.length) {
      toast.error("Some items in your cart are invalid and have been removed. Please try again.");
      return;
    }

    // Build payload exactly like backend expects
    let shipping_zone = null;
    if (data.deliveryMethod === "inside") shipping_zone = "insideDhaka";
    else if (data.deliveryMethod === "outside") shipping_zone = "outsideDhaka";
    
    const payload = {
      customer: {
        name: data.name,
        mobile: data.mobile,
        email: data.email || null,
        address: data.address.trim(),
        country_id: null,
        state_id: null,
        city_id: null,
        area_id: null,
        postal_code: null,
      },
      items: validCartItems.map((item) => {
        // Product IDs are MongoDB ObjectIds (hex strings), not numbers
        // Validate it's a non-empty string
        const productId = String(item.id).trim();
        if (!productId || productId === '' || productId === 'null' || productId === 'undefined') {
          throw new Error(`Invalid product ID: ${item.id}`);
        }
        return {
          id: productId, // Send as string, backend will convert to ObjectId
          qty: Number(item.qty) || 1,
          variant: item.variant || null,
          referral_code: null,
        };
      }),
      shipping_method: "home_delivery",
      shipping_zone: shipping_zone,
      payment_method: "Cash on Delivery",
      payment_number: null,
      promo_code: appliedPromo || null,
      note: "",
      pickup_point_id: null,
      carrier_id: null,
    };

    try {
      setIsLoading(true);
      // Include auth token in headers if user is logged in
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user?.id && accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      
      const responseData = await response.json();

      if (responseData.success) {
        // Clear promo after successful order
        setAppliedPromo(null);
        setCouponData(null);
        setPromoDiscount(0);
        setValue("promoCode", "");
        
        toast.success(responseData.message || "Order placed successfully! 🎉");
        try {
          if (typeof window !== "undefined") {
            const backendData = responseData.data;
            const transactionId =
              backendData?.order_code ||
              backendData?.order_id ||
              backendData?.code ||
              String(backendData?.combined_order_id || "");

            const itemsForAnalytics = selectedCart.map((item) => ({
              item_id: String(item.id),
              item_name: item.name,
              price: item.price,
              quantity: item.qty,
              item_variant: item.variant || "",
              item_brand: "",
              item_category: "",
            }));

            const shipping = effectiveDelivery;
            const value = subtotal - discount - promoDiscount + shipping;

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "purchase",
              ecommerce: {
                transaction_id: transactionId,
                affiliation: "Online Store",
                value,
                tax: 0,
                shipping,
                currency: "BDT",
                coupon: appliedPromo || "",
                items: itemsForAnalytics,
              },
            });

            // Persist minimal order summary for order-complete page
            let shippingMethodLabel = "";
            if (data.deliveryMethod === "inside") shippingMethodLabel = "Inside Dhaka – Home Delivery";
            else if (data.deliveryMethod === "outside") shippingMethodLabel = "Outside Dhaka – Home Delivery";

            const orderSummary = {
              orderId: transactionId || null,
              customer: {
                name: data.name,
                mobile: data.mobile,
                email: data.email || "",
                address: data.address,
              },
              items: selectedCart.map((item) => {
                const itemData = {
                  id: item.id,
                  name: item.name,
                  qty: item.qty,
                  price: item.price,
                  variant: item.variant || null,
                };
                // Debug: log variant info
                if (item.variant) {
                  console.log(`Item ${item.name} has variant:`, item.variant);
                }
                return itemData;
              }),
              shipping: {
                method: data.deliveryMethod,
                methodLabel: shippingMethodLabel,
                charge: effectiveDelivery,
              },
              totals: {
                subtotal,
                discount,
                deliveryCharge: effectiveDelivery,
                promoDiscount,
                total: subtotal - discount + effectiveDelivery - promoDiscount,
              },
            };

            try {
              sessionStorage.setItem("lastOrder", JSON.stringify(orderSummary));
            } catch {}

            // Clear cart and show order complete modal
            clearCart();
            setCompletedOrderId(transactionId || null);
            setShowOrderCompleteModal(true);
            return;
          }
        } catch (e) {
          console.error("Failed to push purchase event", e);
        }
        // Fallback: show modal even if analytics failed
        clearCart();
        setCompletedOrderId(null);
        setShowOrderCompleteModal(true);
      } else {
        toast.error(responseData.message || "Failed to place order ❌");
      }
    } catch (err: unknown) {
      console.error("Order submit error:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Something went wrong while placing the order";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleModalPaymentConfirm = async () => {
  //   if (!paymentData) return;
  //   try {
  //     setIsLoading(true);
  //     await submitOrder(paymentData);
  //     setIsLoading(false);
  //     setShowPaymentModal(false);
  //     router.push("/checkout/ordercomplete");
  //   } catch (error) {
  //     console.error(error);
  //     setIsLoading(false);
  //     toast.error("Something went wrong ❌");
  //   }
  // };

  // const handleModalCancel = () => {
  //   setShowPaymentModal(false);
  //   setPaymentData(null);
  // };

  // ------------------------- JSX -------------------------
  return (
    <div className="w-11/12 mx-auto my-10 min-h-[50vh]">
      <h1 className="text-2xl  md:text-3xl font-bold mb-6">Shipping Information</h1>
      <form onSubmit={handleSubmit(handleConfirmOrder)} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* In Your Cart */}
        <div className="border rounded-md p-4 bg-white shadow-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:text-2xl text-xl font-semibold">In Your Cart</h2>
          </div>
          {selectedCart.length === 0 ? (
            <p className="text-gray-500 text-sm">No items selected.</p>
          ) : (
            selectedCart.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 mb-3 w-11/12 rounded-lg relative">
                <div className="md:w-28 md:h-28 h-20 w-20 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm md:text-lg">{item.name}</h3>
                  {item.variant && (
  <p className="text-xs text-gray-500 mt-1">
    {item.variant}
  </p>
)}
                  <div className="font-semibold text-[#1e40af] text-sm md:text-lg mt-1">
                    ৳{item.price}
                    <span className="line-through text-gray-400 ml-2 text-xs">৳{item.oldPrice}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm md:text-sm">
                    <span className="font-medium">QTY :</span>
                    <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 gap-3">
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => decreaseQty(item)}
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => increaseQty(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item)}
                  className="absolute right-2 bottom-2 text-gray-400 hover:text-red-500 text-lg"
                >
                  <RiDeleteBin6Line className="text-xl mr-2 mb-2" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Customer Info + Shipping */}
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">Customer Information</h2>
            <div className="flex flex-col gap-3">
              <label>Your Name*</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-2 mb-1 rounded"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              <label>Mobile*</label>
              <input
                type="text"
                placeholder="019*******"
                className="border p-2 mb-1 rounded"
                {...register("mobile")}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
              <label>E-mail (optional)</label>
              <input
                type="email"
                placeholder="@email"
                className="border p-2 mb-1 rounded"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              
              <label>Address*</label>
              <input
                type="text"
                placeholder="Delivery address"
                className="border p-2 mb-1 rounded"
                {...register("address")}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
          </div>

          {/* Payment Method */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
  <h2 className="text-lg font-semibold mb-4">Select a Payment Method</h2>

  <Controller
    name="payment"
    control={control}
    defaultValue="cod" // Default selection
    render={({ field }) => (
      <>
        {/* Dropdown for payment selection */}
        <select
          {...field}
          className="w-full border rounded-md p-2 text-lg cursor-pointer"
        >
          <option value="cod"> <FaMoneyBillWave className="inline mr-2" /> Cash On Delivery</option>
          <option value="online">Online Payment (Stripe)</option>
        </select>

        {/* Online payment info */}
        {field.value === "online" && (
          <div className="mt-4 gap-2 mb-5 flex flex-col">
            <h1 className="text-[#8f8f8f] text-sm">We Accept</h1>
            <div className="flex items-center gap-2">
              <Image src="/images/visa.png" alt="Visa" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
              <Image src="/images/mastercard.png" alt="Mastercard" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Secure payment powered by Stripe</p>
          </div>
        )}

        {errors.payment && (
          <p className="text-red-500 text-sm mt-2">{errors.payment.message}</p>
        )}
      </>
    )}
  />
          <div className="flex flex-col md:flex-row gap-4 mt-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Select a delivery method*</label>
              <select
                className="border p-2 rounded w-full cursor-pointer"
                {...register("deliveryMethod")}
              >
                <option value="inside">Inside Dhaka – Home Delivery ({currencySymbol} {insideDhaka.toLocaleString()})</option>
                <option value="outside">Outside Dhaka – Home Delivery ({currencySymbol} {outsideDhaka.toLocaleString()})</option>
              </select>
              {errors.deliveryMethod && (
                <p className="text-red-500 text-sm">{errors.deliveryMethod.message}</p>
              )}
            </div>
          </div>
<label className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
    <input type="checkbox" {...register("agreeTerms")} className="shrink-0" />
    <span className="flex-1">
      I have read & agree to the{" "}
      <span className="text-[#1e40af]">Terms & Conditions, Privacy Policy</span> and{" "}
      <span className="text-[#1e40af]">Return Policy</span>.
    </span>
  </label>
  {errors.agreeTerms && (
    <p className="text-[#1e40af] text-sm">{errors.agreeTerms.message}</p>
  )}
          </div>
  
        {/* Shipping Method */}

          {/* Shipping Method removed, now handled by delivery method dropdown */}
        </div>

        
        <div className="flex flex-col gap-6">
          


          {/* Promo Code */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            {/* <button className="bg-orange-500 text-white px-4 py-2 mb-4">Validate GP Star</button> */}
            <h1 className="text-2xl mb-4 font-semibold">Promo Code</h1>
            <input
              type="text"
              className="border p-2 rounded w-full flex-1"
              {...register("promoCode")}
              placeholder="Coupon Code"
            />
            {/* <input
              type="text"
              className="border p-2 mt-4 rounded w-full flex-1"
              {...register("promoCode")}
              placeholder="Enter Points Here "
            /> */}
            <div className="cursor-pointer flex justify-end items-center">
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isValidatingPromo}
                className="bg-[#1e40af] text-white px-4 py-2 rounded-md hover:bg-orange-300 duration-300 mt-2 disabled:opacity-50"
              >
                {isValidatingPromo ? "Applying..." : "Apply"}
              </button>
            </div>
            {appliedPromo && couponData && (
              <div className="mt-2 p-2 bg-green-50 rounded text-green-700 text-sm flex justify-between items-center">
                <span>
                  ✅ {appliedPromo} applied! {couponData.type === "percentage" ? `${couponData.value}%` : `৳${couponData.value}`} off
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedPromo(null);
                    setCouponData(null);
                    setPromoDiscount(0);
                    setValue("promoCode", "");
                    toast.success("Coupon removed");
                  }}
                  className="text-red-600 hover:text-red-800 ml-2 font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">In Your Order Summary</h2>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Sub Total :</span>
              <span>৳ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Delivery Charge :</span>
              <span>৳ {effectiveDelivery.toLocaleString()}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Discount :</span>
              <span>৳ {discount.toLocaleString()}</span>
            </div>
            {appliedPromo && promoDiscount > 0 && (
              <div className="flex justify-between md:text-lg text-base mb-2 text-green-600 font-medium">
                <span>Promo Discount ({appliedPromo}) :</span>
                <span>-৳ {promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex bg-[#f4f4f4] py-4 px-2 justify-between font-semibold text-[#1e40af] text-lg md:text-xl mt-4">
              <span>Total Amount :</span>
              <span>৳ {total.toLocaleString()}</span>
            </div>
            <button
              type="submit"
              className={`w-full bg-[#1e40af] hover:bg-[#7592f1] text-white py-3 rounded-full font-semibold text-center mt-4 ${
                !isValid ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </form>

      {/* ------------------------- Stripe Payment Modal ------------------------- */}
      {showStripePayment && stripeClientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            <p className="text-gray-600 mb-4">Total Amount: ৳{total.toLocaleString()}</p>
            
            {stripePromise && stripeClientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                <StripePaymentForm
                  clientSecret={stripeClientSecret}
                  amount={total}
                  onPaymentSuccess={handleStripePaymentSuccess}
                  onPaymentError={handleStripePaymentError}
                  onCancel={handleStripePaymentCancel}
                />
              </Elements>
            )}
          </div>
        </div>
      )}

      {/* ------------------------- Order Complete Modal ------------------------- */}
      <OrderCompleteModal
        isOpen={showOrderCompleteModal}
        onClose={() => setShowOrderCompleteModal(false)}
        orderId={completedOrderId}
      />
    </div>
  );
};

export default CheckoutPage;
