"use client";
import { Box } from "@mui/material";
import React from "react";
import RoleTable from "@/components/dashboard/add-role/RoleTable";
// import { populatePermissions } from "@/app/api/permission/populatePermissions";
// import store from "@/redux/store/store";
// import { Provider } from "react-redux";
// import { Notification } from "@/notification/Notification";
// import { AuthProvider } from "@/context/AuthContext";
// import { DeleteSomthing } from "@/app/api/permission/DeletSomthing";
// import { DeleteUser } from "@/app/api/user/DeleteUser";
// import { UpdateUserRestaurant } from "@/app/api/restaurant/UpdateRestaurant";
const page = () => {
  // populatePermissions()
  //  DeleteSomthing()
//  DeleteUser(51)
// UpdateUserRestaurant({restaurantId: 9, name: "Pizzaluxe Restaurant"})
  return (
    <Box>
      <RoleTable />
      {/* <Typography variant="h6" color="textSecondary">
          You do not have permission to view this.{" "}
        </Typography> */}
    </Box>
  );
};

export default page;
