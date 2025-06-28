
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployeePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Redirect to create page with edit mode
    navigate(`/employees/create?edit=${id}`, { replace: true });
  }, [id, navigate]);

  return null;
};

export default EditEmployeePage;
