import { useContractApprove, useContractCall, useContractSend } from '@/hooks/contract';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatEther } from 'ethers/lib/utils';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { identiconTemplate } from './helpers';

type ProductProps = {
  id: number;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<string | null>>;
  clear: () => void;
}

export interface Product {
  name: string;
  price: number;
  owner: string;
  image: string;
  description: string;
  location: string;
  sold: boolean;
}

export const Product = ({id, setLoading, clear, setError}: ProductProps) => {
  const [product, setProduct] = useState<Product>()

  const { address } = useAccount();
  const { data: rawProduct }: any = useContractCall('readProduct', [id], true)
  const { writeAsync: purchase } = useContractSend('buyProduct', [id])
  const { writeAsync: approve } = useContractApprove(product?.price?.toString() || "0")
  const { openConnectModal } = useConnectModal();

  /** Format the product data that we read from the smart contract */
  const getFormatProduct = useCallback(() => {
    if (!rawProduct) return null;
    setProduct({
      owner: rawProduct[0],
      name: rawProduct[1],
      image: rawProduct[2],
      description: rawProduct[3],
      location: rawProduct[4],
      price: Number(rawProduct[5]),
      sold: rawProduct[6].toString(),
    });
  }, [rawProduct]);

   // Call the getFormatProduct function when the rawProduct state changes
    useEffect(() => {
      getFormatProduct();
  }, [getFormatProduct]);

  /** function which handles the purchase interaction with the smart contract */
  const handlePurchase = async () => {
    console.log(id)
    if (!approve || !purchase) {
      throw "Failed to purchase this product";
    }
    // Approve the spending of the product's price, for the ERC20 cUSD contract
    const approveTx = await approve();
    // Wait for the transaction to be mined, (1) is the number of confirmations we want to wait for
    if (approveTx.hash) {
      setLoading("Purchasing...");
       // Once the transaction is mined, purchase the product via our marketplace contract buyProduct function
      return await purchase();
    }
  };

  /** function that is called when the user clicks the purchase button */
  const purchaseProduct = async () => {
    setLoading("Approving ...");
    clear();

    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // If the user is connected, call the handlePurchase function and display a notification
      await toast.promise(handlePurchase(), {
        loading: "Purchasing product...",
        success: "Product purchased successfully",
        error: "Failed to purchase product",
      });
      // If there is an error, display the error message
    } catch (e: any) {
      console.error({ e });
      setError(e?.reason || e?.message || "Something went wrong. Try again.");
      // Once the purchase is complete, clear the loading state
    } finally {
      setLoading(null);
    }
  };

  // If the product cannot be loaded, return null
  if (!product) return null;

  // Format the price of the product from wei to cUSD otherwise the price will be way too high
  const productPriceFromWei = formatEther(
    product?.price.toString() ?? '0'
  );

  return (
    <div className={"shadow-lg relative rounded-b-lg"}>
      <p className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-white xl:aspect-w-7 xl:aspect-h-8 ">
          {/* Show the number of products sold */}
          <span
            className={
              "absolute z-10 right-0 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
            }
          >
            {product?.sold} sold
          </span>
          {/* Show the product image */}
          <img
            src={product?.image}
            alt={"image"}
            className="w-full h-80 rounded-t-md  object-cover object-center group-hover:opacity-75"
          />
          {/* Show the address of the product owner as an identicon and link to the address on the Celo Explorer */}
          <Link
            href={`https://explorer.celo.org/alfajores/address/${product.owner}`}
            className={"absolute -mt-7 ml-6 h-16 w-16 rounded-full"}
          >
            {identiconTemplate(product.owner)}
          </Link>
        </div>

        <div className={"m-5"}>
          <div className={"pt-1"}>
            {/* Show the product name */}
            <p className="mt-4 text-2xl font-bold">{product?.name}</p>
            <div className={"h-40 overflow-y-hidden scrollbar-hide"}>
              {/* Show the product description */}
              <h3 className="mt-4 text-sm text-gray-700">
                {product?.description}
              </h3>
            </div>
          </div>

          <div>
            <div className={"flex flex-row"}>
              {/* Show the product location */}
              <img src={"/location.svg"} alt="Location" className={"w-6"} />
              <h3 className="pt-1 text-sm text-gray-700">{product?.location}</h3>
            </div>

            {/* Buy button that calls the purchaseProduct function on click */}
            <button
              onClick={purchaseProduct}
              className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
            >
              {/* Show the product price in cUSD */}
              Buy for {productPriceFromWei} cUSD
            </button>
          </div>
        </div>
      </p>
    </div>
  );
}
