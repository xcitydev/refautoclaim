"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState,useEffect,useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AddLiquidity } from "@/components/AddLiquidity";
import { RemoveLiq } from "@/components/RemoveLiq";

import Header from "@/components/Header";
import { NearContext } from '@/wallets/near';
const page = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [showfarm , setshowstake] = useState<any>(null)
  const router = useRouter()
  const params = useParams();
  const id = params.id as string;
  const [pool, setPool] = useState<any>(null);
  const formatCurrency = (value: any): string => {
    const numericValue = Number(value); // Convert to number

    if (isNaN(numericValue)) {
      return "$0.00"; // Return a default value if conversion fails
    }

    if (numericValue >= 1_000_000) {
      return `$${(numericValue / 1_000_000).toFixed(2)}M`; // Format in millions
    } else if (numericValue >= 1_000) {
      return `$${(numericValue / 1_000).toFixed(2)}K`; // Format in thousands
    } else {
      return `$${numericValue.toFixed(2)}`; // Format as is
    }
  };
  const fetchPoolById = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(
        `https://api.ref.finance/list-pools-by-ids?ids=${id}`
      );
      const data = await res.json();
      console.log(data[0]);
      setPool(data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  let count = 0;
  useEffect(() => {
    fetchPoolById(id);
  }, [id]);


  async function checkshares( ){
    const getuserdata = await wallet.viewMethod({
      contractId: "auto-claim-main.near",
      method: "get_user",
      args: {
        wallet_id: signedAccountId,
      },
      gas: "300000000000000",
      deposit: "0",
    });
  
    const myshares = await wallet.viewMethod({
  
      contractId :"v2.ref-finance.near"
      , method :  "get_pool_shares"
      , 
      args: {
        pool_id:79, // Pool ID
      account_id: `hillary2.auto-claim-sc.near`
    },
     })
     console.log(myshares)
    // setshare1(myshares)
    setshowstake(myshares)
  
    
     count++
  
  }
  if (count < 2) {
    checkshares()
  }
  return (
    <div className="text-white max-w-4xl mx-auto p-7">
      <div className="h-[20vh]">
        <Header />
      </div>
      <Link
        href="/finance
      "
        className="text-xl font-semibold"
      >
        {"< Pools"}
      </Link>
      <div className="flex justify-between max-w-xl py-3 items-center">
        <p className="text-3xl font-semibold">
          {pool?.token_symbols[0]}-{pool?.token_symbols[1]}{" "}
          {pool?.farm && <span>Farms</span>}
        </p>
        <div>
          <p className=" text-[#4f5f64]">Fee</p>
          <p className="font-semibold"> {(pool?.total_fee / 100).toFixed(2)}%</p>
        </div>
        <div>
          <p className=" text-[#4f5f64]">Current Price</p>
          <p className="font-semibold">1 USDC = 1 NEAR</p>
        </div>
      </div>
      <div className="flex max-w-3xl pt-6 flex-wrap">
        <div className="max-w-xl w-full mr-3">
          <div className="grid grid-cols-3 gap-2 bg-[#0c171f] p-3 rounded-md">
            <div>
              <p>TVL</p>
              <p>{formatCurrency(pool?.tvl)}</p>
            </div>
            <div>
              <p>Volume</p>
              <p>{formatCurrency(pool?.volume)}</p>
            </div>
            <div>
              <p>Fee </p>
              <p>{(pool?.total_fee / 100).toFixed(2)}%</p>
            </div>
          </div>
          <div className="py-4">
            <p className="text-[#4f5f64] text-xl font-semibold py-4">
              Pool Composition
            </p>
            <div className="space-y-5 bg-[#0c171f] p-3 rounded-md">
              <div className="grid grid-cols-3 gap-2">
                <p className="text-[#4f5f64]">Pair</p>
                <p className="text-[#4f5f64]">Amount</p>
                <p className="text-[#4f5f64]">Value</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <p>{pool?.token_symbols[0]}</p>
                <p>100%</p>
                <p>100%</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <p>{pool?.token_symbols[1]}</p>
                <p>0%</p>
                <p>0%</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Card className="w-[250px]">
            <CardHeader>
              <CardTitle>Add Liquidity</CardTitle>
              <CardDescription>
                Add liquidity to the pool to start trading.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-between">
              <AddLiquidity
                poolType1={pool?.token_symbols[0]}
                poolType2={pool?.token_symbols[1]}
                poolTypeID1={pool?.token_account_ids[0]}
                poolTypeID2={pool?.token_account_ids[1]}
                Poolid={id}
              />
            </CardFooter>
          </Card>

          {parseInt(showfarm) > 0 && (
            <Card className="w-[250px] mt-8">
              <CardHeader>
                <CardTitle>Remove Liquidity</CardTitle>
                <CardDescription>
                  Removing liquidty stops auto cliam rewards
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-between">
                <RemoveLiq
                  poolType1={pool?.token_symbols[0]}
                  poolType2={pool?.token_symbols[1]}
                  poolTypeID1={pool?.token_account_ids[0]}
                  poolTypeID2={pool?.token_account_ids[1]}
                  sharez={parseInt(showfarm)}
                  Poolid={id}
                />
              </CardFooter>
            </Card>
          )}

          {parseInt(showfarm) > 0 && (
            //true
            <div className="flex items-center w-[250px] bg-white p-4 rounded-md h-[100px] my-3">
              <div className="w-[100px] text-black">
                <p className="font-semibold text-sm">Farm APR</p>
                <p className="text-sm">12.87%</p>
              </div>
              <div className="w-[150px] space-y-2">
                <p className="font-semibold text-sm text-black">$2.26k/week</p>
                <Button
                  className="w-full text-white p-3"
                  onClick={() => {
                    router.push(`/finance/farm/${id}`);
                  }}
                >
                  <p>Farm Now!</p>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
