// Draw boards
for (var i = 0; i < 10; i ++) {
    innerSpaces[i].draw();
}
for (var i = 0; i < 30; i ++) {
    middleSpaces[i].draw();
}
for (var i = 0; i < 50; i ++) {
    outerSpaces[i].draw();
}

for (var i = 0; i < 10; i ++) {
    innerSpaces[i].draw_name();
}
for (var i = 0; i < 30; i ++) {
    middleSpaces[i].draw_name();
}
for (var i = 0; i < 50; i ++) {
    outerSpaces[i].draw_name();
}

var name = "";
switch (global.piece) {
    case PIECE.ROOK:
		name = "rook";
		break;
	case PIECE.BISHOP:
		name = "bishop";
		break;
	case PIECE.KING:
		name = "king";
		break;
	case PIECE.QUEEN:
		name = "queen";
		break;
	case PIECE.KNIGHT:
		name = "knight";
		break;
	case PIECE.PAWN_C:
		name = "pawn (clockwise)";
		break;
	case PIECE.PAWN_CC:
		name = "pawn (counter-clockwise)";
		break;
	case PIECE.SOLDIER_C:
		name = "soldier (clockwise)";
		break;
	case PIECE.SOLDIER_CC:
		name = "soldier (counter-clockwise)";
		break;
}

draw_set_colour(c_white);
draw_text(0, 0, "Current piece: " + name);