Jekyll::Hooks.register :site, :pre_render, priority: :low do |site|
  def sort_key(item)
    if !item["document"].nil?
      [item["document"].data["sidebar_order"] || 100, (item["document"].data["title"] || "").downcase]
    else
      [100, "zzzzz"]
    end
  end

  def show_item(item)
    if !item["document"].nil?
      !item["document"].data["hide_from_sidebar"]
    else
      true
    end
  end

  def tree_for(docs, root)
    tree = []

    groups = docs.group_by do |doc|
      doc.relative_path.gsub(root, '').split('/').first
    end

    groups.each do |name, docs_for_group|
      new_root = if root.empty?
        "#{name}/"
      elsif !name.include? "."
        "#{root}#{name}/"
      else
        nil
      end

      document = if new_root
        docs_for_group.detect {|doc| doc.path.include? "#{new_root}index."}
      else
        docs_for_group.detect {|doc| doc.path.include? "#{root}#{name}"}
      end

      docs_without_index = docs_for_group.reject {|doc| doc.path.include? "#{new_root}index." }

      items = new_root.nil? ? nil : tree_for(docs_without_index, new_root)

      should_hide_from_sidebar = false

      if !items.nil?
        items.sort_by! { |i| sort_key(i) }

        num_of_items_before = items.length()
        items.select! { |i| show_item(i) }

        should_hide_from_sidebar = items.length() < num_of_items_before && items.length() == 0
      end

      if !should_hide_from_sidebar
        hash = {
          "slug" => name,
          "name" => document.nil? ? name : document.data["title"],
          "document" => document.nil? ? nil : document,
          "items" => items,
          "parent_path" => new_root
        }

        tree.push hash
      end
    end
    tree
  end

  def sort_tree(node)
    if !node["items"].nil?
      node["items"].sort_by! { |i| sort_key(i) }
      node["items"].each { |n| sort_tree(n) }
    end
  end

  mapped = site.collections.map {|c| c[1].docs}
  documents = mapped.flatten()
  tree = tree_for(documents, "")

  # relocate some items
  def adjacent_move(item, stack)
    # TODO: we might have to support direct parent as well
    parent = stack[stack.size - 2]
    if !parent.nil? && !item["document"].nil?
      other_sidebar = item["document"].data["sidebar_relocation"]
      if !other_sidebar.nil? && parent["items"]
        parent["items"].each do |parent_item|
          if parent_item["slug"] == other_sidebar
            parent_item["items"].push item
            return nil
          end
        end
      end
    end

    if !item["items"].nil?
      item["items"] = item["items"].map { |child| adjacent_move(child, stack + [item]) }.compact
    end
    item
  end

  tree = tree.map { |item| adjacent_move(item, []) }
  tree.each do |collection|
    sort_tree(collection)

    config_slug = "#{collection["name"]}_categories"
    config_slug[0] = ""

    if (config = site.data[config_slug])
      collection["items"].sort_by! do |item|
        i = if (cat = config.find_index {|i| i["slug"].eql? item["slug"]})
          cat
        else
          0
        end
        i
      end
    end
  end

  site.config["document_tree"] = tree
end
