import { useContext, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

import { observer } from "mobx-react-lite";
import "../styles/common.css";
import "../styles/dictionary-page.css";

import * as dictionaryApi from "../api-requests/dictionary-api";
import { Toast } from "primereact/toast";

const Dictionary = observer(() => {
  const toast = useRef(null);

  const [dictionaries, setDictionaries] = useState(null);
  const [dictionaryFilters, setDictionaryFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dictionaryFilterValue, setDictionaryFilterValue] = useState("");
  const [selectedDictionary, setSelectedDictionary] = useState(null);

  const [words, setWords] = useState(null);
  const [wordFilters, setWordFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [wordFilterValue, setWordFilterValue] = useState("");

  useEffect(() => {
    loadData();
    initFilters();
  }, []);

  const loadData = async () => {
    try {
      const _dictionaries = await dictionaryApi.getDictionariesReview();
      _dictionaries.map((dictionary) => {
        dictionary.words.map((word) => {
          word.progressCount = word.lexiconProgress[0]?.progressCount || 0;
          word.isLearned = word.lexiconProgress[0]?.isLearned ? "да" : "нет";
        });
      });
      setDictionaries(_dictionaries);
      setSelectedDictionary(_dictionaries[0]);
      setWords(_dictionaries[0].words);
    } catch (error) {}
  };

  const initFilters = () => {
    setDictionaryFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setDictionaryFilterValue("");
    setWordFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setDictionaryFilterValue("");
  };

  const renderHeader = (filterValue, filterChange, tableName) => {
    return (
      <div className="table-header">
        <span className="text-xl text-900 font-bold">{tableName}</span>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterValue}
            onChange={filterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const selectDictionary = (e) => {
    setSelectedDictionary(e.value);
    setWords(dictionaries.find((item) => item.id === e.value.id).words);
  };

  const dictionaryFilterChange = (e) => {
    const value = e.target.value;
    const _dictionaryFilters = { ...dictionaryFilters };

    _dictionaryFilters["global"].value = value;

    setDictionaryFilters(_dictionaryFilters);
    setDictionaryFilterValue(value);
  };

  const dictionaryHeader = renderHeader(
    dictionaryFilterValue,
    dictionaryFilterChange,
    "Словари"
  );

  const wordFilterChange = (e) => {
    const value = e.target.value;
    const _wordFilters = { ...wordFilters };

    _wordFilters["global"].value = value;

    setWordFilters(_wordFilters);
    setWordFilterValue(value);
  };

  const wordHeader = renderHeader(wordFilterValue, wordFilterChange, "Слова");

  const actionDictionaryBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-file-export"
        onClick={() => exportDictionaryRow(rowData.id, rowData.name)}
      />
    );
  };

  const exportDictionaryRow = async (id, dictionaryName) => {
    try {
      await dictionaryApi.getDictionaryForExport(id, dictionaryName);
    } catch (error) {
      // if (error?.response?.status === NOT_FOUND) {
      //   await loadData();
      //   showError(OLD_DATA);
      // } else {
      //   showError(INVALID_INPUT);
      // }
    }
  };

  return (
    <div className="dictionary-container">
      <Toast ref={toast} />
      <div className="tables">
        <DataTable
          className="card"
          value={dictionaries}
          editMode="row"
          dataKey="id"
          filters={dictionaryFilters}
          header={dictionaryHeader}
          globalFilterFields={["name"]}
          sortOrder={1}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          selectionMode="single"
          selection={selectedDictionary}
          onSelectionChange={selectDictionary}
          metaKeySelection={true}
        >
          <Column
            field="name"
            header="название"
            editor={(options) => textEditor(options)}
            sortable
            filterField="name"
          />
          <Column
            field="description"
            header="описание"
            editor={(options) => textEditor(options)}
            sortable
          />
          <Column header="экпортировать" body={actionDictionaryBodyTemplate} />
        </DataTable>
        <DataTable
          className="card"
          value={words}
          editMode="row"
          dataKey="id"
          filters={wordFilters}
          header={wordHeader}
          globalFilterFields={["englishSpelling", "russianSpelling"]}
          sortOrder={1}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
        >
          <Column
            field="englishSpelling"
            header="английский"
            editor={(options) => textEditor(options)}
            sortable
            filterField="englishSpelling"
          />
          <Column
            field="transcription"
            header="транскрипция"
            editor={(options) => textEditor(options)}
            sortable
          />
          <Column
            field="russianSpelling"
            header="русский"
            editor={(options) => textEditor(options)}
            sortable
            filterField="russianSpelling"
          />
          <Column
            field="description"
            header="описание"
            editor={(options) => textEditor(options)}
            sortable
          />
          <Column
            field="isLearned"
            header="выучено"
            editor={(options) => textEditor(options)}
            sortable
          />
          <Column
            field="progressCount"
            header="правильных ответов"
            editor={(options) => textEditor(options)}
            sortable
            headerStyle={{ width: "10px" }}
          />
        </DataTable>
      </div>
    </div>
  );
});

export default Dictionary;
