import { useEffect, useState }              from "react";
import { ApiService }                       from "../../common/apiservices/api-service";
import { TurfsModel, TurfsMethods }         from "../../../model/user/turfsmodel";

export const TurfsService = () => {
  const [turfs, setTurfs]                   = useState<TurfsModel.Turf[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");
  const apiService                          = new ApiService();

  const fetchTurfs: TurfsMethods.Methods["fetchTurfs"] = async () => {
    try {
      setLoading(true);
      setError("");

      const response = (await apiService.sendAuthRequest(TurfsModel.path, {}, "GET")) as TurfsModel.Retval;

      if (response.success) {
        setTurfs(response.data);
      } else {
        setError("Unable to load turfs.");
      }

    } catch (error) {
      console.error(error);
      setError("Error loading turfs.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  return {
    loading,
    error,
    turfs
  };
};