
// Center of the board
x = room_width / 2;
y = room_height / 2;

// Types of pieces
enum PIECE {
    ROOK,
    BISHOP,
    KING,
    QUEEN,
    KNIGHT,
    PAWN_C,
    PAWN_CC,
    SOLDIER_C,
    SOLDIER_CC
}
global.piece = PIECE.ROOK;

// Create board

// Inner decagon
// Start at space 89 and go around
innerSpaces = array_create(10);
for (var i = 0; i < 10; i ++) {
    var colour = (i % 2 == 0) ? c_gray : c_white; // Alternate colours
    innerSpaces[i] = new Space(x, y, 18 + 36 * i, colour, "C" + string((i + 8) % 10)); // Change the angle by 36 degrees each time
}
// Connect each space to the spaces in front of and behind it
for (var i = 0; i < 10; i ++) {
    
    innerSpaces[i].next_edge_n = innerSpaces[(i+1)%10];
    innerSpaces[i].prev_edge_n = innerSpaces[(i+9)%10];
    
    innerSpaces[i].next_vert_n = innerSpaces[(i+2)%10];
    innerSpaces[i].prev_vert_n = innerSpaces[(i+8)%10];
    
	// Set up pointers for knight
    for (var j = i + 1; j % 10 != i; j ++) {
        array_push(innerSpaces[i].same_vert_ns, innerSpaces[j % 10]);
    }
    
}

// Middle decagon
// Start at space 77 and go around
var side_length = innerSpaces[0].side_length;
var distance = side_length + 2 * side_length * dcos(72); // distance from one pointy end to the other
var pos_angle = 198; // Need separate variables for position and orientation angles
var angle = 18;

middleSpaces = array_create(30);
for (var i = 0; i < 30; i ++) {
    
    // Update the position of the 'right arm' every 3rd space
    if (i % 3 == 2) {
        pos_angle = (pos_angle + 36) % 360;
    }
    
    var _x = x + lengthdir_x(distance, pos_angle);
    var _y = y + lengthdir_y(distance, pos_angle);
    
    var colour = (i % 2 == 0) ? c_gray : c_white;
    
    // Figure out how orientation relates to positional angle
    switch (i % 3) {
        case 2:
            angle = pos_angle - 216;
            break;
        case 0:
            angle = pos_angle - 180;
            break;
        case 1:
            angle = pos_angle - 144;
            break;
    }
    
    middleSpaces[i] = new Space(_x, _y, angle, colour, "B" + string((i + 24) % 30));
    
}
for (var i = 0; i < 30; i ++) {
    
    // Edge-connect each space to the spaces in front of and behind it
    middleSpaces[i].next_edge_n = middleSpaces[(i + 1) % 30];
    middleSpaces[i].prev_edge_n = middleSpaces[(i + 29) % 30];
    
    // Vertex-connect each space to the same-coloured spaces in front of
    // and behind it (for bishop, king, queen)
    middleSpaces[i].next_vert_n = middleSpaces[(i + 2) % 30];
    middleSpaces[i].prev_vert_n = middleSpaces[(i + 28) % 30];
    
    // Set up same_vert_ns
    var lb = 0;
    var ub = 0;
    
    switch (i % 3) {
        case 0:
        case 2:
            lb = -2;
            ub = 2;
            break;
        case 1:
            lb = -3;
            ub = 3;
            break;
    }
    
    for (var j = lb; j <= ub; j ++) {
		if (j != 0) {
			array_push(middleSpaces[i].same_vert_ns, middleSpaces[(30 + i + j) % 30]);
		}
    }
    
}
for (var i = 0; i < 10; i ++) {
    
    // Edge-connect inner spaces to their connected middle space (for rooks)
    middleSpaces[3 * i + 1].in_edge_n = innerSpaces[i];
    innerSpaces[i].out_edge_n = middleSpaces[3 * i + 1];
    
    // Vertex-connect inner spaces to their connected middle spaces
    for (var j = -2; j < 5; j ++) {
        array_push(innerSpaces[i].inout_vert_ns, middleSpaces[(30 + 3 * i + j) % 30]);
        array_push(middleSpaces[(30 + 3 * i + j) % 30].inout_vert_ns, innerSpaces[i]);
    }
    
    // Vertex-connect inner spaces to middle spaces of the same orientation
    array_push(innerSpaces[i].out_vert_ns, middleSpaces[(30 + 3 * i - 2) % 30]);
    middleSpaces[(30 + 3 * i - 2) % 30].in_vert_n = innerSpaces[i];
    array_push(innerSpaces[i].out_vert_ns, middleSpaces[(30 + 3 * i) % 30]);
    middleSpaces[(30 + 3 * i) % 30].in_vert_n = innerSpaces[i];
    array_push(innerSpaces[i].out_vert_ns, middleSpaces[(30 + 3 * i + 2) % 30]);
    middleSpaces[(30 + 3 * i + 2) % 30].in_vert_n = innerSpaces[i];
    
}

// Outer Decagon
var distance1 = 2 * distance; // Twice the distance from one pointy end to another
var distance2 = 2 * side_length * (dcos(18) + dcos(54)); // Twice the distance from the pointy end to the middle of the opposite edge
pos_angle = 198;
angle = 18;

// Start at space 45 and go around
outerSpaces = array_create(30);
for (var i = 0; i < 50; i ++) {
    
    // Update the position angle sometimes
    if (i % 5 == 2 || i % 5 == 4) {
        pos_angle = (pos_angle + 18) % 360;
    }
    
    var _x = 0;
    var _y = 0;
    
    var colour = (i % 2 == 0) ? c_gray : c_white;
    
    // Some more complicated rules to determine distance from center and orientation
    switch (i % 5) {
        case 4:
            _x = x + lengthdir_x(distance1, pos_angle);
            _y = y + lengthdir_y(distance1, pos_angle);
            angle = pos_angle - 216;
            break;
        case 0:
            _x = x + lengthdir_x(distance1, pos_angle);
            _y = y + lengthdir_y(distance1, pos_angle);
            angle = pos_angle - 180;
            break;
        case 1:
            _x = x + lengthdir_x(distance1, pos_angle);
            _y = y + lengthdir_y(distance1, pos_angle);
            angle = pos_angle - 144;
            break;
        case 2:
            _x = x + lengthdir_x(distance2, pos_angle);
            _y = y + lengthdir_y(distance2, pos_angle);
            angle = pos_angle - 198;
            break;
        case 3:
            _x = x + lengthdir_x(distance2, pos_angle);
            _y = y + lengthdir_y(distance2, pos_angle);
            angle = pos_angle - 162;
            break;
    }
    
    outerSpaces[i] = new Space(_x, _y, angle, colour, "A" + string((i + 40) % 50));
}
for (var i = 0; i < 50; i ++) {
    
    // Edge-connect each space to the spaces in front of and behind it
    outerSpaces[i].next_edge_n = outerSpaces[(i+1)%50];
    outerSpaces[i].prev_edge_n = outerSpaces[(i+49)%50];
    
    // Edge-connect some outer spaces to inner spaces
    if (i % 5 == 1) {
        outerSpaces[i].in_edge_n = middleSpaces[round((i - 1) / 5 * 3)];
        middleSpaces[round((i - 1) / 5 * 3)].out_edge_n = outerSpaces[i];
    }
    else if (i % 5 == 3) {
        outerSpaces[i].in_edge_n = middleSpaces[round((i - 3) / 5 * 3 + 2)];
        middleSpaces[round((i - 3) / 5 * 3 + 2)].out_edge_n = outerSpaces[i];
    }
    
    // Vertex-connect each space to the same-coloured spaces in front of and behind it
    outerSpaces[i].next_vert_n = outerSpaces[(i+2)%50];
    outerSpaces[i].prev_vert_n = outerSpaces[(i+48)%50];
    
    // Set up same_vert_ns
    var lb = 0;
    var ub = 0;
    
    switch (i % 5) {
        case 0:
        case 2:
        case 4:
            lb = -2;
            ub = 2;
            break;
        case 1:
            lb = -3;
            ub = 2;
            break;
        case 3:
            lb = -2;
            ub = 3;
    }
    
    for (var j = lb; j <= ub; j ++) {
		if (j != 0) {
			array_push(outerSpaces[i].same_vert_ns, outerSpaces[(50 + i + j) % 50]);
		}
    }
    
}
for (var i = 0; i < 30; i ++) {
    
    var lb = 0;
    var ub = 0;
    
    switch (i % 3) {
        case 1:
            lb = -1;
            ub = 1;
            break;
        default:
            lb = -2;
            ub = 3;
    }
    
    // Vertex-connect outer spaces with middle spaces
    for (var j = lb; j <= ub; j ++) {
        array_push(middleSpaces[i].inout_vert_ns, outerSpaces[round((50 + (5/3) * i + j) % 50)]);
        array_push(outerSpaces[round((50 + (5/3) * i + j) % 50)].inout_vert_ns, middleSpaces[i]);
    }
    
    // Vertex-connect outer spaces with certain middle spaces of the same orientation
    if (i % 3 == 0) {
        array_push(middleSpaces[i].out_vert_ns, outerSpaces[(50 + (5/3) * i) % 50]);
        outerSpaces[(50 + (5/3) * i) % 50].in_vert_n = middleSpaces[i];
    }
    else if (i % 3 == 1) {
        array_push(middleSpaces[i].out_vert_ns, outerSpaces[round((50 + (5/3) * i - 1) % 50)]);
        outerSpaces[round((50 + (5/3) * i - 1) % 50)].in_vert_n = middleSpaces[i];
    }
    else if (i % 3 == 2) {
        array_push(middleSpaces[i].out_vert_ns, outerSpaces[round((50 + (5/3) * i + 1) % 50)]);
        outerSpaces[round((50 + (5/3) * i + 1) % 50)].in_vert_n = middleSpaces[i];
    }
    
}