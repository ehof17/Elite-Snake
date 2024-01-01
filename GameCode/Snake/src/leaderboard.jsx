import React from 'react';
export default function Leaderboard({leaderboard}) {
    return (
        <div className="nav">
            <h1>Leaderboard</h1>
        <div className="flex">
            
                <div>Rank</div>
                <div>Name</div>
                <div>Score</div>
                <>
                    {Object.keys(leaderboard).map((id, index) => (
                        <React.Fragment key = {id}>
                        <div>{index + 1}</div>
                        <div>{leaderboard[id].name}</div>
                        <div>{leaderboard[id].score}</div>
                        </React.Fragment>
                    ))}
                </>
            
        </div>
        </div>
    )
}