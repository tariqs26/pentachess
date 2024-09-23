// Change piece being simulated
if (keyboard_check_pressed(ord("1"))) {
    global.piece = PIECE.ROOK;
}
else if (keyboard_check_pressed(ord("2"))) {
    global.piece = PIECE.BISHOP;
}
else if (keyboard_check_pressed(ord("3"))) {
    global.piece = PIECE.KING;
}
else if (keyboard_check_pressed(ord("4"))) {
    global.piece = PIECE.QUEEN;
}
else if (keyboard_check_pressed(ord("5"))) {
    global.piece = PIECE.KNIGHT;
}
else if (keyboard_check_pressed(ord("6"))) {
    global.piece = PIECE.PAWN_C;
}
else if (keyboard_check_pressed(ord("7"))) {
    global.piece = PIECE.PAWN_CC;
}
else if (keyboard_check_pressed(ord("8"))) {
    global.piece = PIECE.SOLDIER_C;
}
else if (keyboard_check_pressed(ord("9"))) {
    global.piece = PIECE.SOLDIER_CC;
}

// Update board
for (var i = 0; i < 10; i ++) {
    innerSpaces[i].step();
}
for (var i = 0; i < 30; i ++) {
    middleSpaces[i].step();
}
for (var i = 0; i < 50; i ++) {
    outerSpaces[i].step();
}