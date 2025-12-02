export const PayablesQuery = `
  query fetchInvoices($pageSize: Int!, $skip: Int!, $account: String, $states: [numeric!], $dueIn: numeric) {
    Invoice(
      where: { buyerAddr: { _eq: $account }, state: { _in: $states }, dueDate: { _lte: $dueIn } },
      limit: $pageSize,
      offset: $skip,
      order_by: { dueDate: asc }
    ) {
      id
      sellerName
      sellerAbn
      sellerAddr
      buyerName
      buyerAbn
      buyerAddr
      invoiceLink
      subtotal
      totalGst
      totalValue
      invoiceDate
      dueDate
      confirmDate
      isValid
      state
      itemsDesc
      txHash
      paidAt
    }
  }
`;

export const ReceivablesQuery = `
  query fetchReceivables($pageSize: Int!, $skip: Int!, $account: String, $states: [numeric!], $dueIn: numeric) {
    Receivable(
      where: { owner: { _eq: $account }, state: { _in: $states }, invoice: { dueDate: { _lte: $dueIn } } },
      limit: $pageSize,
      offset: $skip,
      order_by: { invoice: { dueDate: asc } }
    ) {
      id
      owner
      state
      txHash
      amount
      invoiceNumber
      sellerName
      sellerAbn
      buyerName
      buyerAbn
      itemsDesc
      createdAt
      claimedAt
      invoice {
        id
        sellerName
        sellerAbn
        sellerAddr
        buyerName
        buyerAbn
        buyerAddr
        invoiceLink
        totalValue
        invoiceDate
        dueDate
        confirmDate
        paidAt
      }
    }
  }
`;

export const ReceivablesPoolings = `
  query fetchReceivablesPoolings {
    ReceivablesPooling {
      id
      operator
      bundledAsset
      packageTokenId
      packageName
      sbaOfPackage
      slot
      soldAmount
      blockTimestamp
      receivables {
        amount
        dueDate
      }
    }
  }
`;
