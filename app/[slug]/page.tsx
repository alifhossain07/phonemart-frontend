import {
  FaStar, FaRegStar, FaStarHalfAlt, FaHeart,
  FaCreditCard, FaShieldAlt, FaTruck, FaFacebookF, FaInstagram, FaTwitter, FaYoutube,
  FaEye, FaShoppingBag
} from "react-icons/fa";
import { MdStars } from "react-icons/md";
import ProductActions from "./ProductActions";
import AddToCompare from "./AddToCompare";

// Data fetching logic
import { notFound } from 'next/navigation';
import Image from "next/image";
interface PageParams {
  params: { slug: string }
}

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

async function getProduct(slug: string) {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY");
      return null;
    }

    const baseUrl = API_BASE.replace(/\/+$/, '');
    const url = `${baseUrl}/api/v2/products/${slug}`;
    
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();

    if (!json.success || !json.data || json.data.length === 0) {
      return null;
    }

    return json.data[0];
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: PageParams) {
  const { slug } = params;
  
  // Fetch product from API
  const product = await getProduct(slug);
  
  if (!product) {
    return notFound();
  }



  const rating = product.rating || 0; // e.g. 4.2
  const ratingCount = product.rating_count || 0; // e.g. 123
  return (
    <div className="bg-[#f5f5f5]">
      <div className="w-11/12 mx-auto py-4 md:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 justify-center">
          {/* Left Column - Product Images */}
          <div className="w-full max-w-[550px] mx-auto">
            <div className="w-full max-h-[460px] xl:max-h-[673px] h-full bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
              {/* Main Product Image */}
              <div className="relative mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center aspect-[3/4]">
                {product.thumbnail_image ? (
                  <Image
                    src={product.thumbnail_image}
                    alt={product.name || "Product Image"}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    No image available
                  </div>
                )}
              </div>
            </div>
          </div>
         
          {/* Middle Column - Product Details & Options */}
          <div className="w-full max-w-[550px] mx-auto">
            <div className="w-full h-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col overflow-hidden">
              {/* Product Title */}
              <h1 className="md:text-[24px] text-[20px] font-bold text-gray-900 mb-2">{product.name}</h1>
              {/* Pricing Information */}
              <div className="">
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="md:text-[26px] text-[22px] font-bold text-orange-600">{product.main_price}</span>
                  {product.discount && 
                   product.discount !== "0%" && 
                   product.discount !== "0" && 
                   product.discount !== "" && 
                   product.discount !== 0 && (
                    <>
                      <span className="text-[16px] text-gray-400 line-through">{product.stroked_price}</span>
                      <span className="px-3 py-1  bg-[#E7F3EC] text-[#0A8544] text-sm font-medium rounded-2xl">
                        {typeof product.discount === 'number' ? `-${product.discount}%` : product.discount} off
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Basic Specifications as Bullet Points */}
              {product.basic_specs && (
                <ul className="list-disc list-inside leading-tight space-y-1 mb-4 text-sm text-gray-700">
                  {product.basic_specs.display && (
                    <li><strong>Display:</strong> {product.basic_specs.display}</li>
                  )}
                  {product.basic_specs.processor && (
                    <li><strong>Processor:</strong> {product.basic_specs.processor}</li>
                  )}
                  {product.basic_specs.battery && (
                    <li><strong>Battery:</strong> {product.basic_specs.battery}</li>
                  )}
                  {product.basic_specs.camera && (
                    <li><strong>Camera:</strong> {product.basic_specs.camera}</li>
                  )}
                  {product.basic_specs.others && (
                    <li><strong>Others:</strong> {product.basic_specs.others}</li>
                  )}
                </ul>
              )}
              
              {/* Product Variants, Quantity Selector, and Action Buttons */}
              <ProductActions product={product} />

              {/* Messaging Options */}
              <div className="flex gap-3">
                <button className="flex-1 2xl:text-base text-xs bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.404-.405.765-.674 1.08-.27.315-.58.58-.93.795-.35.215-.73.38-1.14.495-.41.115-.84.173-1.29.173-.45 0-.88-.058-1.29-.173-.41-.115-.79-.28-1.14-.495-.35-.215-.66-.48-.93-.795-.27-.315-.495-.676-.674-1.08-.18-.404-.27-.83-.27-1.278 0-.448.09-.874.27-1.278.18-.404.405-.765.674-1.08.27-.315.58-.58.93-.795.35-.215.73-.38 1.14-.495.41-.115.84-.173 1.29-.173.45 0 .88.058 1.29.173.41.115.79.28 1.14.495.35.215.66.48.93.795.27.315.495.676.674 1.08.18.404.27.83.27 1.278 0 .448-.09.874-.27 1.278z" />
                  </svg>
                  Via Messenger
                </button>
                <button className="flex-1 2xl:text-base text-xs bg-gray-100 text-gray-700 px-2 py-2 rounded font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Via Whats app
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Information */}
          <div className="w-full max-w-[550px] mx-auto">
            <div className="w-full space-y-6 max-h-[773px] bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
              {/* Viewing Statistics */}
              {product.viewing_count !== undefined && (
                <div className="flex font-medium items-center gap-2 text-sm bg-[#F4F4F4] p-4 text-gray-700">
                  <FaEye className="w-5 h-5 text-black" />
                  <span>{product.viewing_count} People Are Viewing This Product</span>
                </div>
              )}
              
              {/* Units Sold */}
              {product.units_sold !== undefined && (
                <div className="flex font-medium items-center gap-2 text-sm bg-[#F4F4F4] p-4 text-gray-700">
                  <FaShoppingBag className="w-5 h-5 text-black" />
                  <span>{product.units_sold} units of this variants sold in the last 4 days</span>
                </div>
              )}

              {/* Rating and Reviews */}
              <div className="flex items-center p-4 mb-3 bg-[#f4f4f4] gap-2">
  <div className="flex items-center font-medium text-sm text-gray-700 mr-3">
    <MdStars className="w-5 h-5 text-black mr-2" />
    Rating:
  </div>

  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => {
      if (rating >= star) {
        // full star
        return <FaStar key={star} className="w-5 h-5 text-orange-500" />;
      }

      if (rating >= star - 0.5) {
        // half star
        return <FaStarHalfAlt key={star} className="w-5 h-5 text-orange-500" />;
      }

      // empty star
      return <FaRegStar key={star} className="w-5 h-5 text-gray-300" />;
    })}
  </div>

  <span className="text-sm text-gray-700">
    ({rating.toFixed(1)}) / {ratingCount > 0 ? `${ratingCount}+ Reviews` : "No reviews"}
  </span>
</div>

              {/* Secondary Action Buttons */}
              <div className="flex gap-2 mb-3">
                <AddToCompare product={product} />
                <button className="flex-1 px-4 py-4 border bg-[#f4f4f4]  border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaHeart className="w-4 h-4" />
                  Add Wishlist
                </button>
              </div>

              {/* Payment Plans */}
              <button className="w-full mb-3 px-4 py-4 border bg-[#f4f4f4]  border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <FaCreditCard className="w-4 h-4" />
                EMI-View Plans
              </button>

              {/* Payment & Shipping Info */}
               <div className="flex gap-2 mb-3">
                <button className="flex-1 px-4 py-4 border border-gray-300 rounded text-sm font-medium bg-[#f4f4f4] hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaShieldAlt className="w-5 h-5 text-black" />
                  <span>Secure Payments</span>
                </button>
                <button className="flex-1 px-4 py-4 border bg-[#f4f4f4]  border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <FaTruck className="w-5 h-5 text-black" />
                  <span>Shipping & Charge</span>
                </button>
              </div>
             

              {/* Share Options */}
              <div className="pt-4 flex items-center border-t border-gray-200">
                <p className="text-sm text-gray-700 mr-3">Share:</p>
                <div className="flex gap-3">
                  <a className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50">
                    <FaFacebookF className="text-black text-lg" />
                  </a>
                  <a className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50">
                    <FaInstagram className="text-black text-lg" />
                  </a>
                  <a className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50">
                    <FaTwitter className="text-black text-lg" />
                  </a>
                  <a className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50">
                    <FaYoutube className="text-black text-lg" />
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}