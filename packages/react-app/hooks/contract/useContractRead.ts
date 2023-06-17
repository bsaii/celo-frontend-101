import { useContractRead } from 'wagmi';
import MarketplaceInstance from "../../abi/Marketplace.json";


export const useContractCall = (functionName: string, args?: Array<any>, watch?: boolean, from? : `0x${string}` | undefined) => {
  const response = useContractRead({
        // The address of the smart contract, in this case the Marketplace from the JSON file
        address: MarketplaceInstance.address as `0x${string}`,
        // The ABI of the smart contract, in this case the Marketplace from the JSON file
        abi: MarketplaceInstance.abi,
        // The smart contract function name to call
        functionName: functionName,
        // The arguments to pass to the smart contract function
        args,
        // A boolean to watch for changes in the smart contract. If true, the hook will re-run when the smart contract changes
        watch,
        // The address of the user to call the smart contract function from which is optional
        // overrides: from ? { from } : undefined,
        onError: (err) => {
            console.error({ err })
        }
    })

    return response
}
