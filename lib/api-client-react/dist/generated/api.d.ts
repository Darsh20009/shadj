import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ActiveUsers, AuthResponse, CategoryCount, GetVisitorLogsParams, HealthStatus, ListPortfolioParams, LoginInput, Order, OrderInput, OrderUpdate, PortfolioWork, PortfolioWorkInput, PortfolioWorkUpdate, SiteStats, TrackEventInput, User, UserInput, UserUpdate, VisitorLog } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPortfolioUrl: (params?: ListPortfolioParams) => string;
/**
 * @summary List all portfolio works
 */
export declare const listPortfolio: (params?: ListPortfolioParams, options?: RequestInit) => Promise<PortfolioWork[]>;
export declare const getListPortfolioQueryKey: (params?: ListPortfolioParams) => readonly ["/api/portfolio", ...ListPortfolioParams[]];
export declare const getListPortfolioQueryOptions: <TData = Awaited<ReturnType<typeof listPortfolio>>, TError = ErrorType<unknown>>(params?: ListPortfolioParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPortfolio>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPortfolio>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPortfolioQueryResult = NonNullable<Awaited<ReturnType<typeof listPortfolio>>>;
export type ListPortfolioQueryError = ErrorType<unknown>;
/**
 * @summary List all portfolio works
 */
export declare function useListPortfolio<TData = Awaited<ReturnType<typeof listPortfolio>>, TError = ErrorType<unknown>>(params?: ListPortfolioParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPortfolio>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreatePortfolioWorkUrl: () => string;
/**
 * @summary Add a new portfolio work
 */
export declare const createPortfolioWork: (portfolioWorkInput: PortfolioWorkInput, options?: RequestInit) => Promise<PortfolioWork>;
export declare const getCreatePortfolioWorkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPortfolioWork>>, TError, {
        data: BodyType<PortfolioWorkInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPortfolioWork>>, TError, {
    data: BodyType<PortfolioWorkInput>;
}, TContext>;
export type CreatePortfolioWorkMutationResult = NonNullable<Awaited<ReturnType<typeof createPortfolioWork>>>;
export type CreatePortfolioWorkMutationBody = BodyType<PortfolioWorkInput>;
export type CreatePortfolioWorkMutationError = ErrorType<unknown>;
/**
* @summary Add a new portfolio work
*/
export declare const useCreatePortfolioWork: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPortfolioWork>>, TError, {
        data: BodyType<PortfolioWorkInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPortfolioWork>>, TError, {
    data: BodyType<PortfolioWorkInput>;
}, TContext>;
export declare const getGetPortfolioWorkUrl: (id: string) => string;
/**
 * @summary Get a single portfolio work
 */
export declare const getPortfolioWork: (id: string, options?: RequestInit) => Promise<PortfolioWork>;
export declare const getGetPortfolioWorkQueryKey: (id: string) => readonly [`/api/portfolio/${string}`];
export declare const getGetPortfolioWorkQueryOptions: <TData = Awaited<ReturnType<typeof getPortfolioWork>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPortfolioWork>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPortfolioWork>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPortfolioWorkQueryResult = NonNullable<Awaited<ReturnType<typeof getPortfolioWork>>>;
export type GetPortfolioWorkQueryError = ErrorType<void>;
/**
 * @summary Get a single portfolio work
 */
export declare function useGetPortfolioWork<TData = Awaited<ReturnType<typeof getPortfolioWork>>, TError = ErrorType<void>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPortfolioWork>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdatePortfolioWorkUrl: (id: string) => string;
/**
 * @summary Update a portfolio work
 */
export declare const updatePortfolioWork: (id: string, portfolioWorkUpdate: PortfolioWorkUpdate, options?: RequestInit) => Promise<PortfolioWork>;
export declare const getUpdatePortfolioWorkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePortfolioWork>>, TError, {
        id: string;
        data: BodyType<PortfolioWorkUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePortfolioWork>>, TError, {
    id: string;
    data: BodyType<PortfolioWorkUpdate>;
}, TContext>;
export type UpdatePortfolioWorkMutationResult = NonNullable<Awaited<ReturnType<typeof updatePortfolioWork>>>;
export type UpdatePortfolioWorkMutationBody = BodyType<PortfolioWorkUpdate>;
export type UpdatePortfolioWorkMutationError = ErrorType<unknown>;
/**
* @summary Update a portfolio work
*/
export declare const useUpdatePortfolioWork: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePortfolioWork>>, TError, {
        id: string;
        data: BodyType<PortfolioWorkUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePortfolioWork>>, TError, {
    id: string;
    data: BodyType<PortfolioWorkUpdate>;
}, TContext>;
export declare const getDeletePortfolioWorkUrl: (id: string) => string;
/**
 * @summary Delete a portfolio work
 */
export declare const deletePortfolioWork: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeletePortfolioWorkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePortfolioWork>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePortfolioWork>>, TError, {
    id: string;
}, TContext>;
export type DeletePortfolioWorkMutationResult = NonNullable<Awaited<ReturnType<typeof deletePortfolioWork>>>;
export type DeletePortfolioWorkMutationError = ErrorType<unknown>;
/**
* @summary Delete a portfolio work
*/
export declare const useDeletePortfolioWork: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePortfolioWork>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePortfolioWork>>, TError, {
    id: string;
}, TContext>;
export declare const getGetFeaturedWorksUrl: () => string;
/**
 * @summary Get featured/highlighted works
 */
export declare const getFeaturedWorks: (options?: RequestInit) => Promise<PortfolioWork[]>;
export declare const getGetFeaturedWorksQueryKey: () => readonly ["/api/portfolio/featured"];
export declare const getGetFeaturedWorksQueryOptions: <TData = Awaited<ReturnType<typeof getFeaturedWorks>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedWorks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFeaturedWorks>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFeaturedWorksQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedWorks>>>;
export type GetFeaturedWorksQueryError = ErrorType<unknown>;
/**
 * @summary Get featured/highlighted works
 */
export declare function useGetFeaturedWorks<TData = Awaited<ReturnType<typeof getFeaturedWorks>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedWorks>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCategoriesUrl: () => string;
/**
 * @summary Get all portfolio categories with counts
 */
export declare const getCategories: (options?: RequestInit) => Promise<CategoryCount[]>;
export declare const getGetCategoriesQueryKey: () => readonly ["/api/portfolio/categories"];
export declare const getGetCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof getCategories>>>;
export type GetCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary Get all portfolio categories with counts
 */
export declare function useGetCategories<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListOrdersUrl: () => string;
/**
 * @summary List all design orders (admin)
 */
export declare const listOrders: (options?: RequestInit) => Promise<Order[]>;
export declare const getListOrdersQueryKey: () => readonly ["/api/orders"];
export declare const getListOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listOrders>>>;
export type ListOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List all design orders (admin)
 */
export declare function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateOrderUrl: () => string;
/**
 * @summary Submit a new design order
 */
export declare const createOrder: (orderInput: OrderInput, options?: RequestInit) => Promise<Order>;
export declare const getCreateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<OrderInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<OrderInput>;
}, TContext>;
export type CreateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof createOrder>>>;
export type CreateOrderMutationBody = BodyType<OrderInput>;
export type CreateOrderMutationError = ErrorType<unknown>;
/**
* @summary Submit a new design order
*/
export declare const useCreateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<OrderInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<OrderInput>;
}, TContext>;
export declare const getGetOrderUrl: (id: string) => string;
/**
 * @summary Get an order
 */
export declare const getOrder: (id: string, options?: RequestInit) => Promise<Order>;
export declare const getGetOrderQueryKey: (id: string) => readonly [`/api/orders/${string}`];
export declare const getGetOrderQueryOptions: <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
export type GetOrderQueryError = ErrorType<unknown>;
/**
 * @summary Get an order
 */
export declare function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateOrderUrl: (id: string) => string;
/**
 * @summary Update order status
 */
export declare const updateOrder: (id: string, orderUpdate: OrderUpdate, options?: RequestInit) => Promise<Order>;
export declare const getUpdateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
        id: string;
        data: BodyType<OrderUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
    id: string;
    data: BodyType<OrderUpdate>;
}, TContext>;
export type UpdateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof updateOrder>>>;
export type UpdateOrderMutationBody = BodyType<OrderUpdate>;
export type UpdateOrderMutationError = ErrorType<unknown>;
/**
* @summary Update order status
*/
export declare const useUpdateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrder>>, TError, {
        id: string;
        data: BodyType<OrderUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOrder>>, TError, {
    id: string;
    data: BodyType<OrderUpdate>;
}, TContext>;
export declare const getLoginUrl: () => string;
/**
 * @summary Login with email and password
 */
export declare const login: (loginInput: LoginInput, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginInput>;
export type LoginMutationError = ErrorType<void>;
/**
* @summary Login with email and password
*/
export declare const useLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export declare const getLogoutUrl: () => string;
/**
 * @summary Logout
 */
export declare const logout: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
* @summary Logout
*/
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export declare const getGetMeUrl: () => string;
/**
 * @summary Get current user
 */
export declare const getMe: (options?: RequestInit) => Promise<User>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<void>;
/**
 * @summary Get current user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListUsersUrl: () => string;
/**
 * @summary List all users (admin)
 */
export declare const listUsers: (options?: RequestInit) => Promise<User[]>;
export declare const getListUsersQueryKey: () => readonly ["/api/users"];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users (admin)
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateUserUrl: () => string;
/**
 * @summary Create a new user (admin)
 */
export declare const createUser: (userInput: UserInput, options?: RequestInit) => Promise<User>;
export declare const getCreateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<UserInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<UserInput>;
}, TContext>;
export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>;
export type CreateUserMutationBody = BodyType<UserInput>;
export type CreateUserMutationError = ErrorType<unknown>;
/**
* @summary Create a new user (admin)
*/
export declare const useCreateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<UserInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<UserInput>;
}, TContext>;
export declare const getUpdateUserUrl: (id: string) => string;
/**
 * @summary Update user role or info
 */
export declare const updateUser: (id: string, userUpdate: UserUpdate, options?: RequestInit) => Promise<User>;
export declare const getUpdateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: string;
        data: BodyType<UserUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: string;
    data: BodyType<UserUpdate>;
}, TContext>;
export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
export type UpdateUserMutationBody = BodyType<UserUpdate>;
export type UpdateUserMutationError = ErrorType<unknown>;
/**
* @summary Update user role or info
*/
export declare const useUpdateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: string;
        data: BodyType<UserUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: string;
    data: BodyType<UserUpdate>;
}, TContext>;
export declare const getDeleteUserUrl: (id: string) => string;
/**
 * @summary Delete user
 */
export declare const deleteUser: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
    id: string;
}, TContext>;
export type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>;
export type DeleteUserMutationError = ErrorType<unknown>;
/**
* @summary Delete user
*/
export declare const useDeleteUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteUser>>, TError, {
    id: string;
}, TContext>;
export declare const getGetStatsUrl: () => string;
/**
 * @summary Get site statistics summary
 */
export declare const getStats: (options?: RequestInit) => Promise<SiteStats>;
export declare const getGetStatsQueryKey: () => readonly ["/api/analytics/stats"];
export declare const getGetStatsQueryOptions: <TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStats>>>;
export type GetStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get site statistics summary
 */
export declare function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetActiveUsersUrl: () => string;
/**
 * @summary Get real-time active users count
 */
export declare const getActiveUsers: (options?: RequestInit) => Promise<ActiveUsers>;
export declare const getGetActiveUsersQueryKey: () => readonly ["/api/analytics/active-users"];
export declare const getGetActiveUsersQueryOptions: <TData = Awaited<ReturnType<typeof getActiveUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActiveUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getActiveUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetActiveUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getActiveUsers>>>;
export type GetActiveUsersQueryError = ErrorType<unknown>;
/**
 * @summary Get real-time active users count
 */
export declare function useGetActiveUsers<TData = Awaited<ReturnType<typeof getActiveUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActiveUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetVisitorLogsUrl: (params?: GetVisitorLogsParams) => string;
/**
 * @summary Get visitor journey logs
 */
export declare const getVisitorLogs: (params?: GetVisitorLogsParams, options?: RequestInit) => Promise<VisitorLog[]>;
export declare const getGetVisitorLogsQueryKey: (params?: GetVisitorLogsParams) => readonly ["/api/analytics/visitor-logs", ...GetVisitorLogsParams[]];
export declare const getGetVisitorLogsQueryOptions: <TData = Awaited<ReturnType<typeof getVisitorLogs>>, TError = ErrorType<unknown>>(params?: GetVisitorLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVisitorLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getVisitorLogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetVisitorLogsQueryResult = NonNullable<Awaited<ReturnType<typeof getVisitorLogs>>>;
export type GetVisitorLogsQueryError = ErrorType<unknown>;
/**
 * @summary Get visitor journey logs
 */
export declare function useGetVisitorLogs<TData = Awaited<ReturnType<typeof getVisitorLogs>>, TError = ErrorType<unknown>>(params?: GetVisitorLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVisitorLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getTrackEventUrl: () => string;
/**
 * @summary Track a visitor event
 */
export declare const trackEvent: (trackEventInput: TrackEventInput, options?: RequestInit) => Promise<HealthStatus>;
export declare const getTrackEventMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof trackEvent>>, TError, {
        data: BodyType<TrackEventInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof trackEvent>>, TError, {
    data: BodyType<TrackEventInput>;
}, TContext>;
export type TrackEventMutationResult = NonNullable<Awaited<ReturnType<typeof trackEvent>>>;
export type TrackEventMutationBody = BodyType<TrackEventInput>;
export type TrackEventMutationError = ErrorType<unknown>;
/**
* @summary Track a visitor event
*/
export declare const useTrackEvent: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof trackEvent>>, TError, {
        data: BodyType<TrackEventInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof trackEvent>>, TError, {
    data: BodyType<TrackEventInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map