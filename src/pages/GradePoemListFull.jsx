export default function GradePoemsPage({ grade }) {
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    loadPoemsByGrade();
  }, [grade]);

  async function loadPoemsByGrade() {
    const data = await getPoemsByGrade(grade);
    setPoems(data);
  }

  return (
    <PoemListPage
      title={`Учат в ${grade} классе`}
      poems={poems}
      backTo="/home"
    />
  );
}
