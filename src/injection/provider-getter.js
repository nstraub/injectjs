import _      from 'lodash';
import {uuid} from '../util';


export default function (item, template) {
    return function (adhoc_dependencies, template_clone) {
        var provider = item();
        if (template.return_provider) {
            return function (adhoc_dependencies) {
                var template_clone = _.cloneDeepWith(template, function(value, key) {
                    switch (key) {
                    case 'root': return value;
                    case 'children': return {};
                    case 'hashCode': return uuid.getNext();
                    default: return;
                    }
                });
                template_clone.parent = template.parent;
                if (template === template.root) {
                    set_root(template_clone, template_clone);
                    if (template_clone.roots) {
                        delete template_clone.roots;
                    }
                }
                return provider.call(this, template_clone, adhoc_dependencies);
            };
        }
        return provider.call(this, template_clone || template, adhoc_dependencies);
    };
}


function set_root(template, root) {
    template.root = root;
    _.each(template.dependencies, function (dependency) {
        set_root(dependency, root);
    });
}
