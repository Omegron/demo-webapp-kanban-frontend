export function CardChangeLocation({ operationInfo, unassignedCards, board }) {
  if (!operationInfo.destination) return;

  const sourceIndex = operationInfo.source.index;
  const sourceId = operationInfo.source.droppableId;
  const destinationId = operationInfo.destination.droppableId;
  let destinationIndex, movedCard, column, cards;

  if (sourceId === destinationId) {
    if (sourceId === 'unassigned-cards') {
      destinationIndex = unassignedCards.length - 1 - operationInfo.destination.index;
      movedCard = unassignedCards.slice().reverse()[sourceIndex];
    } else {
      column = board.columns.find((c) => String(c.id) === sourceId);
      cards = column.cards;
      destinationIndex = operationInfo.destination.index;
      movedCard = cards[sourceIndex];
    }
  } else if (sourceId === 'unassigned-cards' || destinationId === 'unassigned-cards') {
    if (sourceId === 'unassigned-cards') {
      destinationIndex = operationInfo.destination.index;
      movedCard = unassignedCards.slice().reverse()[sourceIndex];
    } else {
      column = board.columns.find((c) => String(c.id) === sourceId);
      cards = column.cards;
      destinationIndex = unassignedCards.length - operationInfo.destination.index;
      movedCard = cards[sourceIndex];
    }
  } else {
    column = board.columns.find((c) => String(c.id) === sourceId);
    cards = column.cards;
    destinationIndex = operationInfo.destination.index;
    movedCard = cards[sourceIndex];
  }

  return {
    movedCard: movedCard,
    destinationIndex: destinationIndex,
    destinationId: destinationId,
  };
}
