const dependency_pattern = /^function *\w* *?\( *((?:\w+|(?:, *?))+) *?\)/;
const separatorPattern = /, */;

export default function (type) {
    const serialized_type = type.toString();
    const serialized_dependencies = dependency_pattern.exec(serialized_type);

    return serialized_dependencies ? serialized_dependencies[1].split(separatorPattern) : undefined;
}
