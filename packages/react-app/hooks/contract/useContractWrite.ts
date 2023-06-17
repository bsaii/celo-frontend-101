import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import MarketplaceInstance from "../../abi/Marketplace.json";

export const useContractSend = (functionName: string, args: Array<any>) => {

    // Prepare the write to the smart contract
    const { config } = usePrepareContractWrite({
        // The address of the smart contract, in this case the Marketplace from the JSON file
        address: MarketplaceInstance.address as `0x${string}`,
        // The ABI of the smart contract, in this case the Marketplace from the JSON file
        abi: MarketplaceInstance.abi,
        // The smart contract function name to call
        functionName,
        // The arguments to pass to the smart contract function
        args,
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
