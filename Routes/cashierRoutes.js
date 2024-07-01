const express = require('express');
const { deleteCashier, getAllCashiers, updatePassword } = require('../Controllers/cashierController');

const router = express.Router();

router.delete('/delete/:id', deleteCashier);
router.get('/', getAllCashiers);
router.put('/update-password/:id', updatePassword);

module.exports = router;