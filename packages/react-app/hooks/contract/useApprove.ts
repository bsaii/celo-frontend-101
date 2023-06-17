import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import Erc20Instance from "../../abi/erc20.json";
import MarketplaceInstance from "../../abi/Marketplace.json";

export const useContractApprove = (price: number | string) => {
    // Prepare the write to the smart contract
    const { config } = usePrepareContractWrite({
        // The address of the smart contract, in this case the ERC20 cUSD token address from the JSON file
        address: Erc20Instance.address as `0x${string}`,
        // The ABI of the smart contract, in this case the ERC20 cUSD token address from the JSON file
        abi: Erc20Instance.abi,
        // The smart contract function name to call
        functionName: 'approve',
        // The arguments to pass to the smart contract function, in this case the Marketplace address and the product price
        args: [MarketplaceInstance.address, price],
        // The gas limit to use when sending a transaction
        gas: BigInt(1000000),
        onError: (err) => {
            console.error({ err })
        }
    })

    // Write to the smart contract using the prepared config
    const { data, isSuccess, write, writeAsync, error, isLoading } = useContractWrite(config)
    return { data, isSuccess, write, writeAsync, isLoading }
}
