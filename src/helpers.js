export const print_object = (object) =>
{
    let string = '{';

    for (const [key, value] of Object.entries(object))
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

    array.forEach((object) =>
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

    array.forEach((element) =>
    {
        string += element + ', ';
    });

    //cut off last two characters
    string = string.substring(0, string.length - 2);
    string += ']';

    return string;
}

export const has_error = (response) =>
{
    return response.hasOwnProperty('error');
}

export const name_to_plan_id = (name) =>
{
    switch (name)
    {
        case 'Basic':
            return 1;
        case 'Standard':
            return 2;
        case 'Premium':
            return 3;
        default:
            return 0;
    }
}

export const plan_id_to_name = (plan_id) =>
{
    switch (plan_id)
    {
        case 1:
            return 'Basic';
        case 2:
            return 'Standard';
        case 3:
            return 'Premium';
        default:
            return 'No plan';
    }
}