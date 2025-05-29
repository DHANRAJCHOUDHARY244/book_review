import autocompleteController from '@controllers/front/autocomplete.controller';
import express from 'express';
const router = express.Router();


// Routes
router.get('/skills/:name',autocompleteController.getSkills.bind(autocompleteController)); 
router.get('/colleges/:name',autocompleteController.getColleges.bind(autocompleteController));
router.get('/schools/:name',autocompleteController.getSchools.bind(autocompleteController));
router.get('/school-boards/:name',autocompleteController.getSchoolBoard.bind(autocompleteController));
router.get('/courses/:name',autocompleteController.getCourses.bind(autocompleteController));
router.get('/languages/:name',autocompleteController.getLanguages.bind(autocompleteController));
router.get('/streams/:name',autocompleteController.getStream.bind(autocompleteController));

// pagination
router.get('/skill-list',autocompleteController.getSkillsPagination.bind(autocompleteController));
router.get('/college-list',autocompleteController.getCollegesPagination.bind(autocompleteController));
router.get('/school-list',autocompleteController.getSchoolsPagination.bind(autocompleteController));
router.get('/school-board-list',autocompleteController.getSchoolBoardPagination.bind(autocompleteController));
router.get('/course-list',autocompleteController.getCoursesPagination.bind(autocompleteController));
router.get('/language-list',autocompleteController.getLanguagesPagination.bind(autocompleteController));
router.get('/stream-list',autocompleteController.getStreamsPagination.bind(autocompleteController));


export default router;