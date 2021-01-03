import { Role } from "./enums";

export interface jwtToken {
	userId: string,
	role: Role
}