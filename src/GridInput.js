import React from 'react';

const GridInput = ({ grid, setGrid, player, crossedNumbers, gameStarted }) => {
    const handleInputChange = (row, col, value) => {
        if (!gameStarted && value >= 1 && value <= 9) {
            const newGrid = grid.map((r, i) => i === row ? [...r] : r);
            newGrid[row][col] = value;
            setGrid(newGrid);
        }
    };

    return (
        <div>
            <h2>{player}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 88px)', gap: '10px' }}>
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`} style={{ position: 'relative', width: '85px', height: '85px', border: '1px solid black', textAlign: 'center' }}>
                            {!gameStarted ? (
                                <input
                                    type="number"
                                    value={cell}
                                    onChange={(e) => handleInputChange(rowIndex, colIndex, parseInt(e.target.value))}
                                    style={{ width: '93%', height: '95%', textAlign: 'center', fontSize: '24px' }}
                                    min="1"
                                    max="9"
                                />
                            ) : (
                                <div style={{ fontSize: '24px', lineHeight: '85px' }}>{cell}</div>
                            )}
                            {/* Display cross icon if the cell is in crossedNumbers and the game has started */}
                            {crossedNumbers.includes(cell) && (
                                <span style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', color: 'red', fontSize: '36px', lineHeight: '100px', textAlign: 'center' }}>
                                    ✖️
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GridInput;
