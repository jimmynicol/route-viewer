/** ----- Enums ----- */

export enum ResourceState {
    Meta = 1,
    Summary = 2,
    Detail = 3,
}

export enum RouteType {
    Ride = 1,
    Run = 2,
}

export enum RouteSubType {
    Road = 1,
    MTB = 2,
    CX = 3,
    Trail = 4,
    Mixed = 5,
}

export enum Sex {
    Female = "F",
    Male = "M",
}

/** ----- Models ----- */

export interface SummaryAthlete {
    id: number;
    resource_state: ResourceState;
    firstname: string;
    lastname: string;
    profile_medium: string;
    profile: string;
    city: string;
    state: string;
    country: string;
    sex: Sex;
    friend: string;
    follower: string;
    premium: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface SummarySegmentEffort {
    id: number;
    elapsed_time: number;
    start_date: Date;
    start_date_local: Date;
    distance: number;
    is_kom: boolean;
}

export interface SummaryPRSegmentEffort {
    pr_activity_id: number;
    pr_elapsed_time: number;
    pr_date: Date;
    effort_count: number;
}

export interface SummarySegment {
    id: number;
    name: string;
    activity_type: string;
    distance: number;
    average_grade: number;
    maximum_grade: number;
    elevation_high: number;
    elevation_low: number;
    start_latlng: number[];
    end_latlng: number[];
    climb_category: number;
    city: string;
    state: string;
    country: string;
    private: boolean;
    athlete_pr_effort: SummarySegmentEffort;
}

export interface DetailedSegment {
    id: number;
    resource_state: number;
    name: string;
    activity_type: string;
    distance: number;
    average_grade: number;
    maximum_grade: number;
    elevation_high: number;
    elevation_low: number;
    start_latlng: number[];
    end_latlng: number[];
    elevation_profile: string;
    start_latitude: number;
    start_longitude: number;
    end_latitude: number;
    end_longitude: number;
    climb_category: number;
    city: string;
    state: string;
    country: string;
    private: boolean;
    hazardous: boolean;
    starred: boolean;
    created_at: string;
    updated_at: string;
    total_elevation_gain: number;
    map: PolylineMap;
    effort_count: number;
    athlete_count: number;
    star_count: number;
    athlete_pr_effort: SummarySegmentEffort;
    athlete_segment_stats: SummaryPRSegmentEffort;
    xoms: {
        kom: string;
        qom: string;
    };
}

export interface PolylineMap {
    id: string;
    polyline: string;
    summary_polyline: string;
}

export interface Route {
    athlete: SummaryAthlete;
    description: string;
    distance: number;
    elevation_gain: number;
    id: number;
    id_str: string;
    map: PolylineMap;
    name: string;
    private: boolean;
    starred: boolean;
    timestamp: boolean;
    type: RouteType;
    sub_type: RouteSubType;
    created_at: Date;
    updated_at: Date;
    estimated_moving_time: number;
    segments: SummarySegment[];
}

/** ------ OAuth Models ----- */
export interface TokenExchangeResponse {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
    expires_in: number;
    athlete?: SummaryAthlete;
}

export interface TokenRefreshResponse {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
    expires_in: number;
}
