import { Type, getValidator, querySyntax } from '@feathersjs/typebox'

export const categorySchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),

    created_at: Type.Number(),
    updated_at: Type.Number()
  },
  { $id: 'Categories', additionalProperties: false }
)