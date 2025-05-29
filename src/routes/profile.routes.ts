import express from "express";
import profileController from "@controllers/front/student/student.profile.controller";
const router = express.Router();

router.post("/v1/onboarding-form-1", profileController.createPersonalCreateDetails.bind(profileController));
router.post("/v1/add-update-education", profileController.addOrUpdateGraduation.bind(profileController));
router.post("/v1/add-update-delete-job_internship", profileController.addOrUpdateInternshipJob.bind(profileController));
router.post("/v1/add-update-academic-personal-projects", profileController.addOrUpdateAcademicPersonalProjects.bind(profileController));
router.post("/v1/add-update-training-courses", profileController.addOrUpdateDeleteTrainingCourse.bind(profileController));
router.post("/v1/add-update-portfolios", profileController.portfolioAddUpdateDelete.bind(profileController));
router.post("/v1/add-update-skills", profileController.skillsAddUpdateDelete.bind(profileController));
router.post("/v1/add-delete-preferences", profileController.updatePreferences.bind(profileController));
router.post("/v1/add-update-career-objective", profileController.addUpdateCareerObjective.bind(profileController));
router.post("/v1/profile-img-upload", profileController.updateProfileImage.bind(profileController));


// get apis
router.get("/v1/get-education", profileController.getEducation.bind(profileController));
router.get("/v1/get-job-internship", profileController.getInternshipJob.bind(profileController));
router.get("/v1/get-academic-personal-projects", profileController.getAcademicPersonalProject.bind(profileController));
router.get("/v1/get-training-courses", profileController.getTrainingCourse.bind(profileController));
router.get("/v1/get-portfolios", profileController.getPortfolio.bind(profileController));
router.get("/v1/get-skills", profileController.getSkills.bind(profileController));
router.get("/v1/get-preferences", profileController.getPreferences.bind(profileController));
router.get("/v1/get-career-objective", profileController.getCareerObjective.bind(profileController));

// get resume
router.get("/v1/get-resume", profileController.getResume.bind(profileController));

export default router;