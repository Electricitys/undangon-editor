import { Type, getValidator, querySyntax } from "@feathersjs/typebox";
import { categorySchema } from "./category";
import { userSchema } from "./user";
import { metadataSchema } from "./metadata";

export const invitationSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    content: Type.String(),
    slug: Type.String(),

    category_id: Type.Number(),
    category: Type.Ref(categorySchema),

    user_id: Type.Number(),
    user: Type.Ref(userSchema),

    metadata_id: Type.Number(),
    metadata: Type.Ref(metadataSchema),

    created_at: Type.Number(),
    updated_at: Type.Number(),
  },
  { $id: "Invitations", additionalProperties: false }
);
