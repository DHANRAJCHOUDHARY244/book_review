import express from 'express';
const router = express.Router();
import permissionController from '@controllers/permission.controller';

router.post("/v1/add", permissionController.addPermission.bind(permissionController));
router.get("/", permissionController.getPermissionPagination.bind(permissionController));
export default router;