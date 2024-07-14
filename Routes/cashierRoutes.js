const express = require('express');
const { deleteCashier, getAllCashiers, updatePassword } = require('../Controllers/cashierController');
const { verifyToken, verifyAdmin } = require('../Middlewares/auth');
const router = express.Router();

router.use(verifyToken);
router.delete('/delete/:id', verifyAdmin, deleteCashier);
router.get('/', verifyAdmin, getAllCashiers);
router.put('/update-password/:id', verifyAdmin, updatePassword);

module.exports = router;