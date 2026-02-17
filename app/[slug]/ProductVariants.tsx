"use client";

import React, { useState, useEffect } from 'react';

interface ChoiceOption {
  name: string;
  title: string;
  options: string[];
}

interface Variant {
  variant: string;
  price: number;
  sku: string;
  qty: number;
  image: string | null;
}

interface ProductVariantsProps {
  choiceOptions?: ChoiceOption[];
  colors?: string[];
  otherFeatures?: string;
  currentStock?: number;
  sku?: string;
  initialColor?: string;
  initialStorage?: string;
  initialRegion?: string;
  variants?: Variant[];
  onVariantChange?: (variant: Variant | null) => void;
  onColorChange?: (color: string) => void;
  onStorageChange?: (storage: string) => void;
  onRegionChange?: (region: string) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  choiceOptions = [],
  colors = [],
  otherFeatures,
  currentStock,
  sku,
  initialColor,
  initialStorage,
  initialRegion,
  variants = [],
  onVariantChange,
  onColorChange,
  onStorageChange,
  onRegionChange,
}) => {
  // State for selected variants
  const [selectedColor, setSelectedColor] = useState<string>(initialColor || colors[0] || '');
  const [selectedStorage, setSelectedStorage] = useState<string>(initialStorage || '');
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion || '');
  const [, setCurrentVariant] = useState<Variant | null>(null);
  const [displayStock, setDisplayStock] = useState<number | undefined>(currentStock);
  const [displaySku, setDisplaySku] = useState<string>(sku || '');

  // Initialize selections from choice options
  useEffect(() => {
    choiceOptions.forEach((choice) => {
      if (choice.title === 'Storage' && choice.options.length > 0 && !selectedStorage) {
        setSelectedStorage(choice.options[0]);
      }
      if (choice.title === 'Region' && choice.options.length > 0 && !selectedRegion) {
        setSelectedRegion(choice.options[0]);
      }
    });
  }, [choiceOptions, selectedStorage, selectedRegion]);

  // Find matching variant based on selected options
  useEffect(() => {
    // Filter out invalid variants (empty objects or missing variant property)
    const validVariants = variants.filter(
      (v) => v && v.variant && v.sku
    );

    if (!selectedColor || !selectedStorage || !selectedRegion || validVariants.length === 0) {
      setCurrentVariant(null);
      setDisplayStock(currentStock);
      setDisplaySku(sku || '');
      onVariantChange?.(null);
      return;
    }

    const colorName = getColorName(selectedColor);
    const variantString = `${colorName}-${selectedStorage}-${selectedRegion}`;
    
    const matchedVariant = validVariants.find(
      (v) => v.variant === variantString
    );

    if (matchedVariant) {
      setCurrentVariant(matchedVariant);
      setDisplayStock(matchedVariant.qty);
      setDisplaySku(matchedVariant.sku);
      onVariantChange?.(matchedVariant);
    } else {
      setCurrentVariant(null);
      setDisplayStock(currentStock);
      setDisplaySku(sku || '');
      onVariantChange?.(null);
    }
  }, [selectedColor, selectedStorage, selectedRegion, variants, currentStock, sku, onVariantChange]);

  // Helper function to get color name from hex code
  const getColorName = (hex: string): string => {
    const colorMap: Record<string, string> = {
      '#9966CC': 'Amethyst',
      '#7FFFD4': 'Aquamarine',
      '#000000': 'Midnight',
      '#FFFFFF': 'White',
      '#FF0000': 'Red',
      '#0000FF': 'Blue',
      '#FFC0CB': 'Pink',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#008000': 'Green',
      '#FFFF00': 'Yellow',
      '#808080': 'Gray',
      '#C0C0C0': 'Silver',
      '#FFD700': 'Gold',
    };
    
    // Normalize hex code (uppercase, add # if missing)
    const normalizedHex = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    
    return colorMap[normalizedHex] || normalizedHex;
  };

  // Get selected color name
  const selectedColorName = selectedColor ? getColorName(selectedColor) : '';

  return (
    <>
      {/* Selected Variants Display */}
      <div className="flex gap-2 rounded-md bg-gray-100 mb-4 flex-wrap">
        {selectedColorName && (
          <span className="px-3 py-1 text-gray-700 text-sm font-base">
            {selectedColorName}
          </span>
        )}
        {selectedRegion && (
          <span className="px-3 py-1 border-l-2 border-gray-300 pl-2 text-gray-700 text-sm font-base">
            {selectedRegion}
          </span>
        )}
        {selectedStorage && (
          <span className="px-3 py-1 border-l-2 border-gray-300 pl-2 text-gray-700 text-sm font-base">
            {selectedStorage}
          </span>
        )}
      </div>

      {/* Key Specifications */}
      {otherFeatures && (
        <ul className="list-disc list-inside leading-tight space-y-1 mb-4 text-sm text-gray-700">
          {otherFeatures
            .split(". ")
            .map((feature: string) => feature.trim())
            .filter(Boolean)
            .map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
        </ul>
      )}

      {/* Status and SKU */}
      <div className="flex bg-gray-100 p-2 rounded-md items-center gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Status: </span>
          {displayStock === 0 ? (
            <span className="text-red-600 font-semibold">Out of stock</span>
          ) : displayStock && displayStock < 5 ? (
            <span className="text-orange-600 font-semibold">Low stock</span>
          ) : (
            <span className="text-green-600 font-semibold">Available</span>
          )}
        </div>
        {displaySku && (
          <div>
            <span className="text-gray-600 border-l-2 border-gray-300 pl-2">SKU: </span>
            <span className="text-gray-700 font-medium">{displaySku}</span>
          </div>
        )}
      </div>

      {/* Storage and Region Options */}
      {choiceOptions.map((choice: ChoiceOption, choiceIndex: number) => (
        <div
          key={choiceIndex}
          className="mb-3 flex items-center bg-[#f4f4f4] p-2"
        >
          <div className="block text-sm font-medium text-gray-700 mr-3">
            {choice.title} :
          </div>

          <div className="flex gap-2">
            {choice.options.map((option: string, optionIndex: number) => {
              const isSelected = 
                (choice.title === 'Storage' && option === selectedStorage) ||
                (choice.title === 'Region' && option === selectedRegion);
              
              return (
                <button
                  key={optionIndex}
                  onClick={() => {
                    if (choice.title === 'Storage') {
                      setSelectedStorage(option);
                      onStorageChange?.(option);
                    } else if (choice.title === 'Region') {
                      setSelectedRegion(option);
                      onRegionChange?.(option);
                    }
                  }}
                  className={`px-4 py-1 rounded text-[12px] font-base transition ${
                    isSelected
                      ? 'bg-gray-800 text-white'
                      : 'bg-[#E5E5E5] text-black hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Color Options */}
      {colors.length > 0 && (
        <div className="flex bg-[#f4f4f4] items-center p-2 mb-3">
          <div className="text-sm font-medium text-gray-700 mr-5">
            Color:
          </div>

          <div className="flex gap-3">
            {colors.map((color: string, index: number) => {
              const isSelected = color === selectedColor;
              const colorName = getColorName(color);
              return (
                <div key={index} className="relative group">
                  <button
                    onClick={() => {
                      setSelectedColor(color);
                      onColorChange?.(color);
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-[24px] h-[24px] rounded-md border-2 transition ${
                      isSelected
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {colorName}
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductVariants;

