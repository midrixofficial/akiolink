import CategoryForm from "./CategoryForm";

function CategoryCreate({ onNavigate }) {
    return <CategoryForm mode="create" onNavigate={onNavigate} />;
}

export default CategoryCreate;
