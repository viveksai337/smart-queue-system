const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', branchController.getAllBranches);
router.get('/cities', branchController.getCities);
router.get('/:id', branchController.getBranchById);
router.post('/', adminAuth, branchController.createBranch);
router.put('/:id', adminAuth, branchController.updateBranch);
router.delete('/:id', adminAuth, branchController.deleteBranch);

module.exports = router;
