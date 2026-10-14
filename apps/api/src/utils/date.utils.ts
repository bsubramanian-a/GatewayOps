export function normalizeDateRange(from?: string, to?: string): { fromDate?: string; toDate?: string } {
  let fromDate = from ? from.trim() : undefined;
  let toDate = to ? to.trim() : undefined;

  if (fromDate && /^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
    fromDate = `${fromDate}T00:00:00.000Z`;
  }

  if (toDate) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
      toDate = `${toDate}T23:59:59.999Z`;
    } else if (toDate.endsWith('T00:00:00.000Z') || toDate.endsWith('T00:00:00') || toDate.endsWith('T00:00')) {
      toDate = `${toDate.slice(0, 10)}T23:59:59.999Z`;
    } else if (fromDate && toDate.slice(0, 10) === fromDate.slice(0, 10) && toDate <= fromDate) {
      toDate = `${toDate.slice(0, 10)}T23:59:59.999Z`;
    }
  }

  return { fromDate, toDate };
}
