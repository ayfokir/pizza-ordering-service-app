"use client";
import React, { useEffect, useState } from "react";
import store from "@/redux/store/store";
import { Provider } from "react-redux";
// import { Notification } from "@/notification/Notification";
import { Box } from "@mui/material";
import { AuthProvider } from "@/context/AuthContext";
import OrderPizzaCard from "@/components/order-pizza/OrderPizzaCard"; // Make sure this component is correctly imported
import RelatedPizza from "@/components/order-pizza/RelatedPizza";
const Page = () => {
  
  return (
    // <Provider store={store}>
        <Box sx={{backgroundColor: "#FFF8F1"}}>
          <OrderPizzaCard />
        <RelatedPizza />
        </Box>
    // </Provider>
  );
};

export default Page;
