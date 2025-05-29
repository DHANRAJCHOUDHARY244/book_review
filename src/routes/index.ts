import express from 'express';
const router = express.Router();
import authRoutes from './auth.routes';
import permissionRoutes from './permissions.routes';
import installerRoutes from './installer.routes';
import customerRoutes from './customer.routes';

router.get('/',(req,res)=>{
    res.send("OK")
})
router.use('/auth', authRoutes);
router.use('/permission',permissionRoutes);
router.use('/v1/installer',installerRoutes);
router.use('/v1/customer',customerRoutes);


export default router;