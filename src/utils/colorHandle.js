function getContrastYIQ(hexcolor) {
    // Convert hex color to RGB
    var r = parseInt(hexcolor.substring(1, 3), 16);
    var g = parseInt(hexcolor.substring(3, 5), 16);
    var b = parseInt(hexcolor.substring(5, 7), 16);

    // Calculate the luminance
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black or white depending on the luminance
    return yiq >= 128 ? 'dark' : 'light';
}

export { getContrastYIQ }