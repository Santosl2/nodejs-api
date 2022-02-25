import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/upload";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { CreateUserService } from "../services/CreateUserService";
import { UpdateUserAvatarService } from "../services/UpdateUserAvatarService";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.get("/", (request, response) => {
  try {
    return response.send();
  } catch (err: Error | any) {}
});

usersRouter.post("/", async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();
    const user = await createUser.execute({ name, email, password });

    delete user.password;

    return response.json(user);
  } catch (err: Error | any) {
    return response.status(400).json({ error: err?.message });
  }
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService();

      if (!request.file) throw new Error("Oops, você se esquece da imagem.");

      const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename,
      });

      delete user?.password;

      return response.json(user);
    } catch (err: Error | any) {}
  },
);

export default usersRouter;
