import express from "express";
import customerController from "@controllers/customer.controller";

const router = express.Router();

router.post("/add-new", customerController.addNew.bind(customerController));
router.get("/list-all", customerController.listCustomer.bind(customerController));
router.get("/:userId", customerController.getCustomer.bind(customerController));
router.delete("/delete", customerController.deleteCustomer.bind(customerController));
router.post("/update-profile-image/:userId", customerController.updateCustomerProfileImage.bind(customerController));
router.post("/update-password",customerController.updateCustomerPassword.bind(customerController));
router.post("/update-customer/:userId",customerController.updateCustomerDetails.bind(customerController))
router.get("/autocomplete-email-or-name",customerController.autocompleteCustomerByNameEmail.bind(customerController))
export default router;
