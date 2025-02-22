"use client";

import { RepeatIcon, RocketIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Pools from "@/components/Pools";
import Swap from "@/components/Swap";
import { SwapCard } from "@/components/SwapCard";
import React, { useEffect, useState, useRef,useContext } from "react";
import { CreateDialog } from "@/components/CreateDialog";
import { Grid } from 'react-loader-spinner'
import { NearContext } from '@/wallets/near';
const Finance = () => {
  const [isregistered , setisregistered] = useState(true);
  const { signedAccountId, wallet } = useContext(NearContext);
  const [loading, setLoading] = useState(true);

  let count = 0;

  async function getdata() {
    const getuserdata = await wallet.viewMethod({
      contractId: "auto-claim-main.near",
      method: "get_user",
      args: {
        wallet_id:"hillary321.near",
      },
      gas: "300000000000000",
      deposit: "0",
    });

    if ( getuserdata !== null){
      setisregistered(false)
      setLoading(false)
    }else {
      setisregistered(true)
      setLoading(false)
    }


  }
 


  if (count < 2) {
    getdata()
  }

  return (
    <div>
      {loading ? <div style={{ background: "transperent",}} className="flex flex-col items-center justify-center min-h-screen bg-darkBlue text-white">
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

        
    </div>
    :
  <>
        <div className="h-[20vh]">
        <Header />
      </div>
{isregistered ?    
  <div className="flex flex-col items-center justify-center text-white text-center">
  <p className="mb-4 text-lg font-medium max-w-sm sm: max-w-3xl">
    To continue, please click the button below to create your subaccount.
  </p>
  <CreateDialog />
</div>
 

:  

<Tabs defaultValue="Pools" className="w-full">
        <TabsList className="grid sm:max-w-xl max-w-sm mx-auto grid-cols-2 my-2">
          <TabsTrigger value="Pools" className="space-x-2">
            <RocketIcon className="w-4 h-4" />
            <p>Pools</p>
          </TabsTrigger>
          <TabsTrigger value="swap">
            <RepeatIcon className="w-4 h-4" />
            <p>Swap</p>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Pools">
          <Pools />
        </TabsContent>
        <TabsContent value="swap">
          <SwapCard/>
          {/* <Swap/> */}
        </TabsContent>
      </Tabs>}
  
  </>
  
  }


    </div>
  );
};

export default Finance;
