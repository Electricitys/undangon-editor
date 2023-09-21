import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { categorySchema } from './category'
import { userSchema } from './user'

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

    created_at: Type.Number(),
    updated_at: Type.Number()
  },
  { $id: 'Invitations', additionalProperties: false }
)