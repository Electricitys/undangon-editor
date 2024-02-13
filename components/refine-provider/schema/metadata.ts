import { Type } from "@feathersjs/typebox";

export const metadataSchema = Type.Object(
  {
    id: Type.Number(),
    title: Type.String(),
    description: Type.Optional(Type.String()),
    url: Type.Optional(Type.String()),

    image: Type.Optional(Type.String()),
    image_width: Type.Optional(Type.String()),
    image_height: Type.Optional(Type.String()),

    created_at: Type.Number(),
    updated_at: Type.Number(),
  },
  { $id: "Metadata", additionalProperties: false }
);
