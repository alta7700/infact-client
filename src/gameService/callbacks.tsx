export function addPlayer(player: Player, room: RoomState<"waiting">): RoomState<"waiting"> {
    return {...room, players: [...room.players, player]};
}

export function excludePlayer(playerId: PlayerId, room: RoomState<"waiting">): RoomState<"waiting"> {
    return {
        ...room,
        players: room.players.filter(p => p.id !== playerId),
        readyPlayers: room.readyPlayers.filter(id => id !== playerId),
    };
}

export function setPlayerConnected(playerId: PlayerId, connected: boolean, room: RoomState): RoomState {
    return {
        ...room,
        players: room.players.map(p => p.id === playerId ? {...p, connected} : p)
    };
}

export function setPlayerReadyState(playerId: PlayerId, value: boolean, room: RoomState<"waiting">): RoomState<"waiting"> {
    if (value) {
        return {...room, readyPlayers: [...room.readyPlayers, playerId]};
    } else {
        return {...room, readyPlayers: room.readyPlayers.filter(v => v !== playerId)};
    }
}


export function setLeader(playerId: PlayerId, room: RoomState): RoomState {
    return {...room, leaderId: playerId};
}

export function addFact(fact: Fact, isOwn: boolean, room: RoomState<"facts">): RoomState<"facts"> {
    return {
        ...room,
        facts: [...room.facts, fact],
        ownFactId: isOwn ? fact.id : room.ownFactId,
    };
}

export function dropFact(factId: FactId, room: RoomState<"facts">): RoomState<"facts"> {
    return {
        ...room,
        facts: room.facts.filter(f => f.id !== factId),
        ownFactId: factId === room.ownFactId ? null : room.ownFactId,
    };
}

export function setTurn(playerId: PlayerId, room: RoomState<"about" | "turns">): RoomState<"about" | "turns"> {
    return {...room, currentTurn: playerId};
}

export function changeCandidates(
    changeFactId: FactId, newCandidates: PlayerId[],
    room: RoomState<"turns" | "answers">
): RoomState<"turns" | "answers"> {
    return {
        ...room,
        candidates: room.candidates.map(([factId, candidates]) =>
            [factId, factId === changeFactId ? newCandidates : candidates]
        )
    }
}

export function setMyAnswer(answer: PlayerFinalAnswer, room: RoomState<"answers">): RoomState<"answers"> {
    return {...room, answer, answersSent: [...room.answersSent, room.ownId]};
}

export function dropMyAnswer(room: RoomState<"answers">): RoomState<"answers"> {
    return {...room, answer: null, answersSent: room.answersSent.filter(id => id !== room.ownId)};
}

export function addPlayerAnswerSent(playerId: PlayerId, room: RoomState<"answers">): RoomState<"answers"> {
    return {
        ...room, answersSent: [...room.answersSent, playerId],
    };
}
export function dropPlayerAnswerSent(playerId: PlayerId, room: RoomState<"answers">): RoomState<"answers"> {
    return {
        ...room, answersSent: room.answersSent.filter(id => id !== playerId),
    };
}
