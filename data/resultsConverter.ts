import {
    RideEfforts,
    RideSegment,
    SegmentAchievement,
    SegmentEffort,
} from "./stravaDataTypes";

export interface PREffort extends SegmentEffort {
    segmentId: string;
    athleteId: string;
}

export interface GCRider {
    name: string;
    athleteId: string;
    athlete_link: string;
    segments: number;
    timeInSeconds: number;
}

export interface GeneralClassification {
    men: GCRider[];
    women: GCRider[];
}

export interface RiderStats {
    id: string;
    name: string;
    athlete_link: string;
    prs: number;
    top10s: number;
    clubXoms: number;
    xoms: number;
    segments: number;
    completedRide: boolean;
    rideScore: number;
}

export interface TalliedRideEfforts {
    stats: {
        numberOfRiders: number;
        numberOfPRs: number;
        numberOfClubXoms: number;
        numberOfXOMs: number;
        longestSegment: [string, number];
        steepestSegment: [string, number];
        segmentWithMostPRs: [string, number];
    };
    riders: Record<string, RiderStats>;
    riderOfTheDay: RiderStats;
    xoms: {
        men: PREffort[];
        women: PREffort[];
    };
    clubXoms: {
        men: PREffort[];
        women: PREffort[];
    };
    prs: {
        men: PREffort[];
        women: PREffort[];
    };
    generalClassification: GeneralClassification;
}

function determineNumberOfRiders(results: RideEfforts) {
    const tmp: Record<string, boolean> = {};

    for (const segmentId in results.segments) {
        const segment: RideSegment = results.segments[segmentId];
        for (const effort of segment.efforts.men) {
            tmp[effort.athlete_link] = true;
        }
        for (const effort of segment.efforts.women) {
            tmp[effort.athlete_link] = true;
        }
    }

    return Object.keys(tmp).length;
}

function determineLongestSegment(results: RideEfforts): [string, number] {
    let greatestDistance = 0;
    let longestSegment = "";

    for (const segmentId in results.segments) {
        const segment: RideSegment = results.segments[segmentId];

        if (segment.segment.distance > greatestDistance) {
            greatestDistance = segment.segment.distance;
            longestSegment = segment.segment.name;
        }
    }

    return [longestSegment, greatestDistance];
}

function determineSteepestSegment(results: RideEfforts): [string, number] {
    let steepestGrade = 0;
    let steepestSegment = "";

    for (const segmentId in results.segments) {
        const segment: RideSegment = results.segments[segmentId];

        if (segment.segment.average_grade > steepestGrade) {
            steepestGrade = segment.segment.average_grade;
            steepestSegment = segment.segment.name;
        }
    }

    return [steepestSegment, steepestGrade];
}

function determineSegmentWithMostPRs(results: RideEfforts): [string, number] {
    let mostPRs = 0;
    let segmentWithMostPRs = "";

    for (const segmentId in results.segments) {
        const segment: RideSegment = results.segments[segmentId];
        let prs = 0;

        for (const effort of segment.efforts.men) {
            if (effort.achievement > 0) prs++;
        }
        for (const effort of segment.efforts.women) {
            if (effort.achievement > 0) prs++;
        }

        if (prs > mostPRs) {
            mostPRs = prs;
            segmentWithMostPRs = segment.segment.name;
        }
    }

    return [segmentWithMostPRs, mostPRs];
}

function tallyResultsByRider(results: RideEfforts) {
    const resultsByRider: Record<string, RiderStats> = {};
    const numberOfSegments = results.segmentsInOrder.length;

    const tallyByRider = (effort: SegmentEffort) => {
        let riderStats = resultsByRider[effort.athlete_link];

        if (!riderStats) {
            resultsByRider[effort.athlete_link] = riderStats = {
                id: effort.athlete_link.split("/").slice(-1)[0],
                name: effort.athlete_name,
                athlete_link: effort.athlete_link,
                prs: 0,
                top10s: 0,
                clubXoms: 0,
                xoms: 0,
                segments: 0,
                completedRide: false,
            } as RiderStats;
        }

        riderStats.segments++;

        if (effort.achievement > 0) riderStats.prs++;
        if (effort.achievement === 2) riderStats.top10s++;
        if (effort.achievement === 3) riderStats.xoms++;
        if (effort.achievement === 4) riderStats.clubXoms++;

        riderStats.completedRide = riderStats.segments === numberOfSegments;

        riderStats.rideScore =
            riderStats.prs + // reward PRs
            3 * riderStats.top10s + // bonus for top10
            4 * riderStats.clubXoms + // more for clubXOM
            6 * riderStats.xoms + // lots more for a XOM
            (riderStats.prs === numberOfSegments ? 20 : 0); // bonus round for prs on all segments
    };

    for (const segmentId of results.segmentsInOrder) {
        const segment: RideSegment = results.segments[segmentId];
        segment.efforts.men.forEach(tallyByRider);
        segment.efforts.women.forEach(tallyByRider);
    }

    return resultsByRider;
}

function determineRiderOfTheDay(resultsByRider: Record<string, RiderStats>) {
    const arr = Object.values(resultsByRider);

    return arr
        .filter((rider) => rider.completedRide)
        .sort((a, b) => b.rideScore - a.rideScore)[0];
}

function determineClubXoms(results: RideEfforts) {
    for (const segmentId of results.segmentsInOrder) {
        const segment: RideSegment = results.segments[segmentId];
        const clubXomMan = segment.clubXoms.men[0].segment_effort_id;
        const clubXomWoman = segment.clubXoms.women[0].segment_effort_id;

        for (const effort of segment.efforts.men) {
            if (clubXomMan === effort.segment_effort_id) {
                if (effort.achievement !== SegmentAchievement.XOM) {
                    effort.achievement = SegmentAchievement.CLUB_XOM;
                }
            }
        }
        for (const effort of segment.efforts.women) {
            if (clubXomWoman === effort.segment_effort_id) {
                if (effort.achievement !== SegmentAchievement.XOM) {
                    effort.achievement = SegmentAchievement.CLUB_XOM;
                }
            }
        }
    }
}

function listClubXOMs(results: RideEfforts) {
    const men: PREffort[] = [];
    const women: PREffort[] = [];

    for (const segmentId of results.segmentsInOrder) {
        const segment: RideSegment = results.segments[segmentId];
        for (const effort of segment.efforts.men) {
            const athleteId = effort.athlete_link.split("/").slice(-1)[0];
            if (effort.achievement === SegmentAchievement.CLUB_XOM)
                men.push({ segmentId, athleteId, ...effort } as PREffort);
        }
        for (const effort of segment.efforts.women) {
            const athleteId = effort.athlete_link.split("/").slice(-1)[0];
            if (effort.achievement === SegmentAchievement.CLUB_XOM)
                men.push({ segmentId, athleteId, ...effort } as PREffort);
        }
    }

    return {
        men,
        women,
    };
}

function listXOMs(results: RideEfforts) {
    const men: PREffort[] = [];
    const women: PREffort[] = [];

    for (const segmentId of results.segmentsInOrder) {
        const segment: RideSegment = results.segments[segmentId];
        for (const effort of segment.efforts.men) {
            const athleteId = effort.athlete_link.split("/").slice(-1)[0];
            if (effort.achievement === SegmentAchievement.XOM)
                men.push({ segmentId, athleteId, ...effort } as PREffort);
        }
        for (const effort of segment.efforts.women) {
            const athleteId = effort.athlete_link.split("/").slice(-1)[0];
            if (effort.achievement === SegmentAchievement.XOM)
                men.push({ segmentId, athleteId, ...effort } as PREffort);
        }
    }

    return {
        men,
        women,
    };
}

function listPRs(results: RideEfforts) {
    const men: PREffort[] = [];
    const women: PREffort[] = [];

    for (const segmentId of results.segmentsInOrder) {
        const segment: RideSegment = results.segments[segmentId];
        for (const effort of segment.efforts.men) {
            const athleteId = effort.athlete_link.split("/").slice(-1)[0];
            if (effort.achievement > 0)
                men.push({ segmentId, athleteId, ...effort } as PREffort);
        }
        for (const effort of segment.efforts.women) {
            const athleteId = effort.athlete_link.split("/").slice(-1)[0];
            if (effort.achievement > 0)
                women.push({ segmentId, athleteId, ...effort } as PREffort);
        }
    }

    return {
        men,
        women,
    };
}

function determineGC(results: RideEfforts) {
    const numSegments = results.segmentsInOrder.length;
    const men: Record<string, GCRider> = {};
    const women: Record<string, GCRider> = {};

    for (const segmentId in results.segments) {
        const segment: RideSegment = results.segments[segmentId];
        for (const effort of segment.efforts.men) {
            const maleEffort = men[effort.athlete_link];
            if (!maleEffort) {
                men[effort.athlete_link] = {
                    name: effort.athlete_name,
                    athleteId: effort.athlete_link.split("/").slice(-1)[0],
                    athlete_link: effort.athlete_link,
                    segments: 1,
                    timeInSeconds: effort.elapsed_time,
                } as GCRider;
            } else {
                maleEffort.segments += 1;
                maleEffort.timeInSeconds += effort.elapsed_time;
            }
        }
        for (const effort of segment.efforts.women) {
            const femaleEffort = women[effort.athlete_link];
            if (!femaleEffort) {
                women[effort.athlete_link] = {
                    name: effort.athlete_name,
                    athleteId: effort.athlete_link.split("/").slice(-1)[0],
                    athlete_link: effort.athlete_link,
                    segments: 1,
                    timeInSeconds: effort.elapsed_time,
                } as GCRider;
            } else {
                femaleEffort.segments += 1;
                femaleEffort.timeInSeconds += effort.elapsed_time;
            }
        }
    }

    // filter by athletes that did not do all the segments
    const maleEfforts = Object.values(men)
        .filter((effort) => effort.segments === numSegments)
        .sort((a, b) => a.timeInSeconds - b.timeInSeconds);
    const femaleEfforts = Object.values(women)
        .filter((effort) => effort.segments === numSegments)
        .sort((a, b) => a.timeInSeconds - b.timeInSeconds);

    return {
        men: maleEfforts,
        women: femaleEfforts,
    } as GeneralClassification;
}

function doubleCheckAchievements(results: RideEfforts) {
    for (const segmentId of results.segmentsInOrder) {
        const segment: RideSegment = results.segments[segmentId];
        const xomsMen = segment.xoms.men[0].segment_effort_id;
        const xomsWomen = segment.xoms.women[0].segment_effort_id;
        const clubXomsMen = segment.clubXoms.men[0].segment_effort_id;
        const clubXomsWomen = segment.clubXoms.women[0].segment_effort_id;

        for (const effort of segment.efforts.men) {
            if (
                effort.achievement === SegmentAchievement.XOM &&
                xomsMen !== effort.segment_effort_id
            ) {
                effort.achievement = SegmentAchievement.NONE;
            }

            if (
                effort.achievement === SegmentAchievement.CLUB_XOM &&
                clubXomsMen !== effort.segment_effort_id
            ) {
                effort.achievement = SegmentAchievement.NONE;
            }
        }
        for (const effort of segment.efforts.women) {
            if (
                effort.achievement === SegmentAchievement.XOM &&
                xomsWomen !== effort.segment_effort_id
            ) {
                effort.achievement = SegmentAchievement.NONE;
            }

            if (
                effort.achievement === SegmentAchievement.CLUB_XOM &&
                clubXomsWomen !== effort.segment_effort_id
            ) {
                effort.achievement = SegmentAchievement.NONE;
            }
        }
    }
}

export function resultsConverter(results: RideEfforts): TalliedRideEfforts {
    determineClubXoms(results);
    doubleCheckAchievements(results);

    const prs = listPRs(results);
    const xoms = listXOMs(results);
    const clubXoms = listClubXOMs(results);

    const numPRs = prs.men.length + prs.women.length;
    const numXoms = xoms.men.length + xoms.women.length;
    const numClubXoms = clubXoms.men.length + clubXoms.women.length;

    const talliedResultsByRider = tallyResultsByRider(results);

    return {
        stats: {
            numberOfRiders: determineNumberOfRiders(results),
            numberOfPRs: numPRs,
            numberOfClubXoms: numClubXoms,
            numberOfXOMs: numXoms,
            longestSegment: determineLongestSegment(results),
            steepestSegment: determineSteepestSegment(results),
            segmentWithMostPRs: determineSegmentWithMostPRs(results),
        },
        riders: talliedResultsByRider,
        riderOfTheDay: determineRiderOfTheDay(talliedResultsByRider),
        xoms,
        clubXoms,
        prs,
        generalClassification: determineGC(results),
    };
}

export function riderResultsToHighlightString(riderResults: RiderStats) {
    const result = [];
    const { prs, top10s, clubXoms, xoms, segments } = riderResults;

    result.push(
        segments === 1 ? `${segments} Segment` : `${segments} Segments`
    );

    if (prs > 0 || top10s > 0 || clubXoms > 0 || xoms > 0) {
        const count = prs;
        result.push(`${count} PR${count !== 1 ? "s" : ""}`);
    }
    if (top10s > 0) {
        result.push(`${top10s} Top10${top10s !== 1 ? "s" : ""}`);
    }
    if (clubXoms > 0) {
        result.push(`${clubXoms} ClubXOM${clubXoms !== 1 ? "s" : ""}`);
    }
    if (xoms > 0) {
        result.push(`${xoms} XOM${xoms !== 1 ? "s" : ""}`);
    }

    return result.join(", ");
}
