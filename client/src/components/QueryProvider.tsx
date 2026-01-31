'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Props } from "next/script";
import { useState } from "react";

export default function QueryProvider({ children }: Props){
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
      }
    }
  }))
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}