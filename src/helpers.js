export const print_object = (object) =>
{
    let string = '{';

    for(const [key, value] of Object.entries(object))
    {
        string += key + ': ' + value + ', ';
    }

    string = string.substring(0, string.length - 2);
    string += '}';

    return string;
}

export const print_object_array = (array) =>
{
    let string = '[';

    array.forEach( (object) =>
    {
        string += print_object(object) + ', ';
    });

    string = string.substring(0, string.length - 2);
    string += ']';

    return string;
}

export const print_array = (array) =>
{
    let string = '[';

    array.forEach( (element) =>
    {
        string += element + ', ';
    });

    //cut off last two characters
    string = string.substring(0, string.length - 2);
    string += ']';
    
    return string;
}