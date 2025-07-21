import { Router } from "express";
import { createNcrForm, getNcrFormByUser, getNcrForms, updateNcrForm,  } from "../controllers/ncrFormController";

const router = Router();
router.post("/", createNcrForm);
router.get("/", getNcrForms);
router.get("/:userId", getNcrFormByUser);
router.put("/:id", updateNcrForm);

export default router;
