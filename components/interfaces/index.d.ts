export interface TimestampSchema {
  created_at: string;
  updated_at: string;
}

export interface DefaultDataSchema extends TimestampSchema {
  id: number;
}

export interface AuthenticationResponse {
  accessToken: string;
  authentication: object;
  user: UserSchema;
}

export type UserRolesSchema = "admin" | "maintainer" | "user" | "public";

export interface UserSchema extends DefaultDataSchema {
  name: string;
  email: string;
  password: string;
  googleId: string;
  role: UserRolesSchema;
}

export interface CategorySchema extends DefaultDataSchema {
  name: string;
}
export interface PackageSchema extends DefaultDataSchema {
  name: string;
  description: string;
  price: number;
}

export interface TemplateSchema extends DefaultDataSchema {
  name: string;
  content: string;
  thumbnail_url: string;

  category_id: number;
  category: CategorySchema;
  user_id: number;
  user: UserSchema;
}

export interface PresetTypeSchema extends DefaultDataSchema {
  label: string;
  description?: string;
}

export interface PresetSchema extends DefaultDataSchema {
  label: string;
  content: string;
  thumbnail_url: string;

  type_id: number;
  type: PresetTypeSchema;
  user_id: number;
  user: UserSchema;
}

export interface InvitationSchema extends DefaultDataSchema {
  name: string;
  content: string;
  slug: string;

  share_message: string;
  thumbnail_url: string;

  category_id: number;
  category: CategorySchema;
  user_id: number;
  user: UserSchema;

  package_id: number;
  package: PackageSchema;

  metadata_id: number;
  metadata: MetadataSchema;
}

export interface MetadataSchema extends DefaultDataSchema {
  title: string;
  description?: string;
  url: string;

  image?: string;
  image_width?: string;
  image_height?: string;
}

export interface MessageSchema extends DefaultDataSchema {
  title: string;
  message: string;
  token: string;
}

export interface FeathersFindResult<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}
