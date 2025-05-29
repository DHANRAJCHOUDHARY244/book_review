import express from "express";
import installerController from "@controllers/installer.controller";

const router = express.Router();

router.post("/add-new", installerController.addNew.bind(installerController));
router.get("/list-all", installerController.listInstaller.bind(installerController));
router.get("/:userId", installerController.getInstaller.bind(installerController));
router.delete("/delete", installerController.deleteInstaller.bind(installerController));
router.post("/update-profile-image/:userId", installerController.updateInstallerProfileImage.bind(installerController));
router.post("/update-password",installerController.updateInstallerPassword.bind(installerController));
router.post("/update-installer/:userId",installerController.updateInstallerDetails.bind(installerController))
export default router;
