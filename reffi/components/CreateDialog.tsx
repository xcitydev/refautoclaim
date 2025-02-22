"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlusIcon } from "lucide-react";
import { useState,useEffect,useContext } from "react";
import { NearContext } from '@/wallets/near';
import { Grid } from 'react-loader-spinner'
import Header from "@/components/Header";
export function CreateDialog() {
  const [open, setOpen] = useState(false);
  const { signedAccountId, wallet } = useContext(NearContext);
  const [loading, setLoading] = useState(false);
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  function stripSuffix(userId : any) {
    const parts = userId.split('.');
    return parts.length > 1 ? parts[0] : userId; // Return first part if there's a dot, else return the full input
}



async function Createaccount(username : any) {
setLoading(true)
  const response = await fetch("http://localhost:3003/createAccount", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username }),
});
const apiResult = await response.json();
const transactions = [
  {
    receiverId: "auto-claim-main.near", // The recipient of the transfer and function call
    actions: [
      {
        type: "Transfer",
        params: {
          deposit: "2000000000000000000000000", // 2 NEAR in yoctoNEAR; change to "1000000000000000000000000" for 1 NEAR if desired.
        },
      },
      {
        type: "FunctionCall",
        params: {
          methodName: "store_user",
          args: {
            username: stripSuffix(signedAccountId),
            subaccount_id: signedAccountId,
          },
          gas: "30000000000000",
          deposit: "0",
        },
      },
    ],
  },
];
 const maketrans = await wallet.signAndSendTransactions({
  transactions
});
// setLoading(false)
// console.log(maketrans);
}


  return (
<>
    {loading ? <div style={{ background: "transperent",}} className="flex flex-col items-center justify-center  bg-darkBlue text-white">
    <div className="h-[0vh]">
      <Header />
    </div>
    <Grid
visible={true}
height="80"
width="80"
color="#4fa94d"
ariaLabel="grid-loading"
radius="12.5"
wrapperStyle={{}}
wrapperClass="grid-wrapper"
/>

      
  </div>  :    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <CirclePlusIcon className="w-5 h-5 text-green-500 cursor-pointer hover:text-green-600" />
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={handleCreate}>
      <DialogHeader>
        <DialogTitle>Create Subaccount </DialogTitle>
        <DialogDescription>Welcome to the ref finance auto claim, to continue you are required to create a subaccount which would cost you 2 Near tokens, Click the button below to proceed</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4"></div>
      <DialogFooter>
        <Button onClick={() => {
          Createaccount(signedAccountId)}} type="submit">Create Account</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>}  
</>
  
  );
}
