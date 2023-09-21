import {
  AbilityBuilder,
  createAliasResolver,
  createMongoAbility,
} from "@casl/ability";
import { AccessControlProvider } from "@refinedev/core";
import { UserSchema } from "../interfaces";
import { authProvider } from "./authProvider";

export const PERMISSIONS = {
  MANAGE: "manage",
  CREATE: "create",
  READ: "read",
  UPDATE: "edit",
  DELETE: "delete",
};

const resolveAction = createAliasResolver({
  list: ["read"],
  show: ["read"],
  edit: ["update"],
});

export const defineAbilityFor = (user: UserSchema) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === "admin") {
    can(PERMISSIONS.MANAGE, "all");
    cannot(
      [PERMISSIONS.CREATE, PERMISSIONS.UPDATE],
      ["invitations", "templates"]
    );
  } else {
    can(PERMISSIONS.MANAGE, "invitations", {
      user_id: user.id,
    });
    can(PERMISSIONS.MANAGE, "templates", {
      user_id: user.id,
    });
  }

  return build({ resolveAction });
};

export const canHandler: AccessControlProvider["can"] = async ({
  action,
  params,
  resource,
}) => {
  // console.log(action, params, resource);
  try {
    const identity = await authProvider.getIdentity?.();
    const grant = defineAbilityFor((identity as any).user).can(
      action,
      resource as string
    );
    return {
      can: grant,
    };
  } catch (err) {
    return {
      can: false,
      reason: "Unauthorized",
    };
  }
};
