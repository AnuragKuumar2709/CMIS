export type JwtPayload = {
	sub: string;
	email: string;
	role: 'ADMIN' | 'STAFF' | 'STUDENT';
};

export type Role = JwtPayload['role'];
